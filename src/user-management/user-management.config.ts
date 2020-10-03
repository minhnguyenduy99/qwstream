export const MODULE_CONFIG_KEY = {
    SECRET_HASH_KEY: "SECRET_HASH_KEY"
}

export const ModuleConfigLoader = () => ({
    SECRET_HASH_KEY: process.env.SECRET_HASH_KEY
})