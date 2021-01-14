import { MODULE_KEYS } from "./redis-core.const";
import { Redis as _Redis } from "ioredis";

export { RedisCoreModule } from "./redis-core.module";
export * from "./redis-core.interfaces";
export const REDIS_GLOBAL = MODULE_KEYS.REDIS_GLOBAL;
export const REDIS_LOCAL = MODULE_KEYS.REDIS_LOCAL;
export type Redis = _Redis;