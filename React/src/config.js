import configJson from "./auth_config.json";

export function getConfig() {
  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    audience: "https://gyaneshgouraw.auth0.com/api/v2/"

  };
}