import { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useFetch = (url) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const { getAccessTokenSilently } = useAuth0();

  const refetch = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url, getAccessTokenSilently]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    error,
    loading,
    profile,
    refetch,
  };
};
