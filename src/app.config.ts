export const APP_CONFIG_KEY = {
    HOST: "HOST",
    PORT: "PORT",
    SWAGGER_API_PATH: "SWAGGER_API_PATH"
}

export const AppConfig = () => ({
    HOST: process.env.HOST || "localhost",
    PORT: parseInt(process.env.PORT) || 3000,
    SWAGGER_API_PATH: process.env.SWAGGER_API_PATH
})