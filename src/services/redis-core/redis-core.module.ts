import { DynamicModule, Logger, Module, Provider } from "@nestjs/common";
import Redis from "ioredis";
import { DEFAULT_REDIS_KEY_PREFIX, DEFAULT_REDIS_SERVER_PORT, MODULE_KEYS } from "./redis-core.const";
import { RedisConfig, RedisCoreModuleOptions, RedisServiceProvider } from "./redis-core.interfaces";


@Module({
    providers: [
        {
            provide: Logger,
            useValue: new Logger("RedisCoreModule")
        }
    ]
})
export class RedisCoreModule {

    static forRoot(options: RedisCoreModuleOptions): DynamicModule {
        const { redis } = options;
        const { 
            providers: redisProviders, 
            imports: redisImports 
        } = this.getRedisServiceConfig(redis, MODULE_KEYS.REDIS_GLOBAL);

        return {
            global: true,
            module: RedisCoreModule,
            imports: [
                ...redisImports
            ],
            providers: redisProviders,
            exports: [MODULE_KEYS.REDIS_GLOBAL]
        }
    }

    static forFeature(options: RedisCoreModuleOptions): DynamicModule {
        const { redis } = options;
        const { providers: redisProviders, imports: redisImports } = this.getRedisServiceConfig(redis, MODULE_KEYS.REDIS_LOCAL);

        return {
            module: RedisCoreModule,
            imports: [
                ...redisImports
            ],
            providers: redisProviders,
            exports: [MODULE_KEYS.REDIS_LOCAL]
        }
    }

    private static getRedisServiceConfig(redis: RedisConfig | RedisServiceProvider, defaultProvide: string | symbol) {
        if (!redis) {
            throw new Error("[RedisCoreModule] Redis config is invalid");
        }
        let providers: Provider<any>[] = [];
        let imports = [];
        if ("host" in redis) {
            providers.push(this.getRedisServiceProvider(redis));
        } else {
            const { imports: redisImports, useFactory, inject } = redis;
            imports.push(...redisImports);
            providers.push({
                provide: MODULE_KEYS.REDIS_CONFIG,
                useFactory,
                inject
            });
            providers.push({
                provide: defaultProvide,
                useFactory: (config: RedisConfig, logger: Logger) => {
                    return this.getRedis(config, logger);
                },
                inject: [MODULE_KEYS.REDIS_CONFIG, Logger]
            });
        }
        return {
            providers,
            imports
        }
    }

    private static getRedisServiceProvider(config: RedisConfig): Provider<any> {
        return {
            provide: MODULE_KEYS.REDIS_LOCAL,
            useFactory: (logger: Logger) => {
                return this.getRedis(config, logger);
            },
            inject: [Logger]
        }
    }

    private static async getRedis(options: RedisConfig, logger: Logger) {
        const { 
            host, 
            port = DEFAULT_REDIS_SERVER_PORT,
            keyPrefix = DEFAULT_REDIS_KEY_PREFIX
        } = options;
        if (!host) {
            throw new Error("Invalid redis host");
        }
        let redis: Redis.Redis;
        let isError = false;
        try {
            redis = new Redis({ 
                host, port, 
                keyPrefix,
                maxRetriesPerRequest: 0,
                reconnectOnError: (error) => false
            });
            await redis.info();
        } catch (error) {   
            isError = true;
            logger.error(`Connection to redis server failed at ${host}:${port}`);
        } finally {
            if (isError) {
                redis.disconnect();
            } else {
                logger.log(`Connect successfully at ${host}:${port}`);
            }
            return redis;
        }
    }
}