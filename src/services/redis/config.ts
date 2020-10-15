

export const REDIS_SUBSCRIBER_CLIENT = "subcriberClient";
export const REDIS_PUBLISHER_CLIENT = "publisherClient";
export const REDIS_CLIENT = "redisClient";

export interface RedisServer {
    host: string;
    port: number;
}

export const RedisConfigLoader = () => ({
    redisServer: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10)
    }
});

