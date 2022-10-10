
import { useAuth0 } from "@auth0/auth0-react";
import { Alert, Button, Table, UncontrolledAlert } from "reactstrap";
import { useFetch} from '../hooks/useFetch';
import Loading from "./Loading";
import { linkContext } from '../utils/context';
import { getConfig } from "../config";
import { useState } from "react";


function isPrimary (primaryUserId, identity) {
    return identity.provider !== primaryUserId.split("|")[0] ||
    identity.user_id !== primaryUserId.split("|")[1];
}

const LinkedAccounts = () => {

    const { domain } = getConfig();
    const {
        getAccessTokenSilently,
        user,
    } = useAuth0();

    const {
        loginWithPopup,
        getIdTokenClaims
    } = useAuth0(linkContext);
    const { profile, loading, error, refetch } = useFetch(`https://${domain}/api/v2/users/${user.sub}`);

    const [ linkError, setLinkError ] = useState(null);

    const linkAccount = async () => {
        const accessToken = await getAccessTokenSilently();
        const { sub } = user;

        await loginWithPopup({
            max_age: 0,
            scope: 'openid'
        });

        const {
            __raw: targetUserIdToken,
            email_verified,
            email
        } = await getIdTokenClaims();

        if (!email_verified) {
            setLinkError(`Account linking is only allowed to a verified account. Please verify your email ${email}.`);
            return;
        }

        await fetch(`https://${domain}/api/v2/users/${sub}/identities`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                link_with: targetUserIdToken,
            }),
        });
        refetch()
    };

    const unlinkAccount = async (profile, i) => {
        const { provider, user_id } = profile;
        const accessToken = await getAccessTokenSilently();
        const { sub } = await user;
        await fetch(
          `https://${domain}/api/v2/users/${sub}/identities/${provider}/${user_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        refetch();
    };

    const canLink = !loading && !error && profile.email_verified === true;

    return (
        <>
            {error ?
                <p>Failed to load</p>
                : null}
            {linkError ?
                <UncontrolledAlert color="danger" toggle={() => setLinkError(null)}>{linkError}</UncontrolledAlert> 
                : null }
            {loading ?
                <Loading /> 
                : null
            }
            {
                profile?.email_verified === false ?
                <Alert color="danger">{`The email ${profile.email} is not verified. Account linking is only allowed for verified emails.`}</Alert> 
                 : null
            }

            {canLink ?
                <>
                    <p><strong>Linked accounts:</strong></p>
                    <Table className="table table-striped table-hover accounts">
                        <thead>
                            <tr>
                                <th>connection</th>
                                <th>isSocial</th>
                                <th>provider</th>
                                <th>user_id</th>
                                <th>profileData</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {profile
                            ?.identities
                            ?.filter(identity => isPrimary(profile.user_id, identity))
                            .map((identity, i) => (
                            <tr key={i}>
                                <td>{identity.connection}</td>
                                <td>{''+identity.isSocial}</td>
                                <td>{identity.provider}</td>
                                <td>{identity.user_id}</td>
                                <td>{JSON.stringify(identity.profileData, null, 2)}</td>
                                <td>
                                    <Button
                                        color="danger"
                                        className="mt-5"
                                        onClick={() => unlinkAccount(identity, i)}
                                    >
                                        Unlink
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="mx-auto">
                        <Button
                            color="primary"
                            className="mt-5"
                            block={false}
                            onClick={linkAccount}
                        >
                            Link Account
                        </Button>
                    </div>
                    
                </>
            : null
            }
        </>
    )
}

export default LinkedAccounts;