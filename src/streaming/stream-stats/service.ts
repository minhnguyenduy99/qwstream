import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { REDIS_LOCAL, Redis } from "src/services/redis-core";
import { STREAM_STATS_CODES } from "./consts";
import { CreateStreamStatsOutput, StreamStatsDTO } from "./dto";
import { EVENTS } from "./events";
import { IStreamStatsService } from "./interfaces";


@Injectable()
export class StreamStatsService implements IStreamStatsService {

    constructor(
        @Inject(REDIS_LOCAL) private readonly redis: Redis,
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: Logger
    ) {
    }

    async createStats(streamId: string, streamStats: StreamStatsDTO): Promise<CreateStreamStatsOutput> {
        let stats = await this.redis.get(streamId);
        console.log(stats);
        if (stats) {
            return {
                code: STREAM_STATS_CODES.STREAM_STATS_EXISTS,
                data: JSON.parse(stats)
            };
        }
        if (streamStats.view_count_denta < 0) {
            streamStats.view_count_denta = 0;
        }
        await this.redis.set(streamId, JSON.stringify(streamStats));
        this.eventEmitter.emitAsync(EVENTS.STATS_CREATED, streamStats);
        this.logger.debug(`[${this.constructor.name}] Stats is created for stream id: ${streamId}`);
        return {
            code: STREAM_STATS_CODES.SUCCESS,
            data: streamStats
        }
    }

    async getStats(streamId: string): Promise<StreamStatsDTO> {
        const statsStr = await this.redis.get(streamId);
        return statsStr ? JSON.parse(statsStr) : null;
    }

    async updateStats(streamId: string, updateStats: StreamStatsDTO) {
        await this.redis.set(streamId, JSON.stringify(updateStats));
        this.eventEmitter.emitAsync(EVENTS.STATS_UPDATED, updateStats);
    }

    async deleteStats(streamId: string) {
        const removedKeys = await this.redis.del(streamId);
        return removedKeys > 0;
    }
}