export const OfficialConfigLoader = () => ({
    secretKey: process.env.AUTH_SECRET_KEY,
    accessTokenExpires: Number.parseInt(process.env.ACCESS_TOKEN_EXPIRES),
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES
})
