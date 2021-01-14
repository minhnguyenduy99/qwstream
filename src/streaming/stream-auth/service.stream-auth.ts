import { v4 } from "uuid";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KEYS } from "./config";
import { GenerateStreamKeyResult, VertifyStreamKeyResult } from "./interfaces";
import { REDIS_LOCAL, Redis } from "src/services/redis-core";
import { AUTH_RESULTS } from "./consts";



@Injectable()
export class StreamAuthService {

    protected streamHostDomain: string;
    protected streamKeyExpiredTime: any;

    constructor(
        @Inject(REDIS_LOCAL) private readonly redisServer: Redis,
        private config: ConfigService,
    ) {
        this.streamHostDomain = this.config.get(KEYS.STREAM_SERVER);
        this.streamKeyExpiredTime = this.config.get(KEYS.STREAM_KEY_EXPIRE_TIME);
    }

    async generateStreamKey(stream_id: string): Promise<GenerateStreamKeyResult> {
        const key = v4().replace(/-/g, "_");
        await this.redisServer.set(key, stream_id, "ex", this.streamKeyExpiredTime);
        return {
            key: key,
            url: `${this.streamHostDomain}?stream_id=${stream_id}`
        }
    }

    async vertifyStreamKey(key: string, stream_id: string): Promise<VertifyStreamKeyResult> {
        const streamId = await this.redisServer.get(key);
        if (!streamId) {
            return {
                code: AUTH_RESULTS.KEY_EXPIRED,
                message: "Key is expired"
            }
        }
        if (streamId !== stream_id) {
            return {
                code: AUTH_RESULTS.INVALID_STREAM_ID,
                message: "Stream ID is invalid"
            }
        }
        return {
            code: AUTH_RESULTS.VALID
        }
    }
}