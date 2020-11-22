
export interface GoogleCredential {
  client_id: string;
  project_id: string;
  auth_url: string;
  token_uri: string;
  auth_provider: string;
  client_secret: string;
  redirect_uris: string[];
  scopes: string[];
}

export const CREDENTIALS = "CREDENTIALS";

export interface ModuleConfig {
  configFolder: string;
  configFile: string;
}

export const ModuleConfigLoader = () => ({
  config: {
    configFolder: process.env.GOOGLE_AUTH_CONFIG_FOLDER || "", 
    configFile: process.env.GOOGLE_AUTH_CONFIG_FILE || "",
  }
})