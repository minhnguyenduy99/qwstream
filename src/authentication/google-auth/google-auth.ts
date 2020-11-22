/* eslint-disable no-var */
import { google } from "googleapis";
import { GoogleCredential } from "./auth.config";

let _googleAuth = new google.auth.OAuth2();
let _scopes: string[] = [];

export default {
  initAuth: ({ client_id, client_secret, redirect_uris, scopes }: GoogleCredential): void => {
    _googleAuth = new google.auth.OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uris[0]
    });
    _scopes = scopes;
  },

  googleAuth2: () => _googleAuth,
  getAuthURL: () => _googleAuth.generateAuthUrl({
    scope: _scopes,
    access_type: "offline"
  })
}