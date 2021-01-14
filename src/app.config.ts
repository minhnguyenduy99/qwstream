import { join } from "path";
// Defines the variable key
export const APP_CONFIG_KEY = {
    HOST: "APP_HOST",
    PORT: "APP_PORT",
    REDIS_HOST: "REDIS_HOST",
    REDIS_PORT: "REDIS_PORT",
    SWAGGER_API_PATH: "SWAGGER_API_PATH",
    ROOT_DIR: "ROOT_DIR",
    PUBLIC_FOLDER: "PUBLIC_FOLDER",
    HTTPS: "HTTPS"
};

// Get the value from environment and set it to a variable
export const AppConfig = () => ({
    HOST: process.env.HOST || "localhost",
    PORT: parseInt(process.env.PORT) || 3000,
    ROOT_DIR: join(__dirname, ".."),
    PUBLIC_FOLDER: process.env.PUBLIC_FOLDER,
    SWAGGER_API_PATH: process.env.SWAGGER_API_PATH,
    HTTPS: process.env.IS_HOST_HTTPS || false,
    [APP_CONFIG_KEY.REDIS_HOST]: process.env.REDIS_HOST,
    [APP_CONFIG_KEY.REDIS_PORT]: parseInt(process.env.REDIS_PORT) || 6379
});