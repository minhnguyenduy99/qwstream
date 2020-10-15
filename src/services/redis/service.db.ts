import { Inject, Injectable } from "@nestjs/common";
import { REDIS_CLIENT } from "./config";
import { SetUniqueKeyOutput } from "./dto";
import { RedisClient } from "./module";


@Injectable()
export class RedisDBService {


    constructor(
        @Inject(REDIS_CLIENT) private readonly redisDB: RedisClient
    ) {}

    
    async setUniqueKey(key: string, value: string): Promise<SetUniqueKeyOutput> {
        const valueWithkey = await this.redisDB.get(key);
        if (valueWithkey === value && value !== null) {
            return {
                code: 1
            };
        }
        await this.redisDB.set(key, value);
        return {
            code: 0
        }
    }

    async getUniqueKey(key: string): Promise<string> {
        return this.redisDB.get(key);
    }

    async delete(key: string): Promise<boolean> {
        const number = await this.redisDB.del(key);
        return number === 1;
    }
}   