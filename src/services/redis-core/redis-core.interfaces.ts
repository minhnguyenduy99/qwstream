import { ModuleMetadata } from "@nestjs/common";
import { Redis } from "ioredis";

export interface RedisCoreModuleOptions {
    redis: RedisConfig | RedisServiceProvider;
}

export interface RedisServiceProvider extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => RedisConfig | Promise<RedisConfig>;
    inject: any[];
}

export interface RedisConfig {
    host: string;
    port?: number;
    keyPrefix?: string;
}

export type RedisService = Redis;