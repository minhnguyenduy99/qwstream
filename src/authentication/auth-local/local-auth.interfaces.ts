

export interface RefreshTokenPayload {
    uid: string;
}

export interface AccessTokenPayload {
    uid: string;
}

export interface UserData {
    _id: string;
    username: string;
    online_status: number;
    profile?: any;
}