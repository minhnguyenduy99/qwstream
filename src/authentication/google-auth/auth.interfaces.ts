export interface GoogleAuthInfo {
  authURL: string;
  oauth2: any;
}


export interface RefreshTokenInfo {
  token: string;
  isExpired: boolean;
}