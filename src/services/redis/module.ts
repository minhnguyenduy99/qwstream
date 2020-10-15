import { Logger, Module } from "@nestjs/common";
import { Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";

import { RedisConfigLoader, RedisServer, REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT, REDIS_CLIENT } from "./config";
import { RedisDBService } from "./service.db";
import { RedisPubSubService } from "./service.pub-sub";

export type RedisClient = Redis.Redis;

const logger = new Logger("RedisModule");

const getRedisClient = async (configService: ConfigService) => {
    const { host, port } = configService.get<RedisServer>("redisServer");
    let client: RedisClient;
    let isError = false;
    try {
        client = new Redis({ 
            host, port, 
            maxRetriesPerRequest: 0,
            reconnectOnError: (error) => false
        });
        await client.info();
    } catch (error) {   
        isError = true;
        logger.error(`Connection to redis server failed at ${host}:${port}`);
    } finally {
        if (isError) {
            client.disconnect();
        } else {
            logger.log("Connect successfully");
        }
        return client;
    }
}

export const redisProviders: Provider[] = [
    {
        useFactory: getRedisClient,
        inject: [ConfigService],
        provide: REDIS_SUBSCRIBER_CLIENT
    },
    {
        useFactory: getRedisClient,
        inject: [ConfigService],
        provide: REDIS_PUBLISHER_CLIENT,
    },
    {
        useFactory: getRedisClient,
        inject: [ConfigService],
        provide: REDIS_CLIENT
    },
    RedisPubSubService,
    RedisDBService
];

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [RedisConfigLoader]
        })
    ],
    providers: redisProviders,
    exports: [RedisPubSubService, RedisDBService]
})
export class RedisModule {

}