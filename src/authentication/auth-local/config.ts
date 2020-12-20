export const CONFIG_KEY = {
    accessTokenSecretKey: "atsk",
    accessTokenExpires: "atexp",
    refreshTokenSecretKey: "rtsk",
    refreshTokenExpires: "rtexp"
}

export const LocalAuthConfigLoader = () => ({
    [CONFIG_KEY.accessTokenSecretKey]: process.env.LOCAL_AUTH_ACCESS_TOKEN_SECRET_KEY,
    [CONFIG_KEY.accessTokenExpires]: parseInt(process.env.LOCAL_AUTH_ACCESS_TOKEN_EXPIRES),
    [CONFIG_KEY.refreshTokenSecretKey]: process.env.LOCAL_AUTH_REFRESH_TOKEN_SECRET_KEY,
    [CONFIG_KEY.refreshTokenExpires]: process.env.LOCAL_AUTH_REFRESH_TOKEN_EXPIRES
});
