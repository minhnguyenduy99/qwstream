export const CONFIG = {
    REDIS_HOST: "redisHost",
    REDIS_PORT: "redisPort",
}

export const DEFAULT_ADAPTER_INTERVAL_TIME = 10000;


export const ConfigLoader = () => ({
    [CONFIG.REDIS_HOST]: process.env.STREAM_REDIS_HOST,
    [CONFIG.REDIS_PORT]: parseInt(process.env.STREAM_REDIS_PORT),
});
