import { Module } from "@nestjs/common";
import { RedisModule } from "@services/redis";
import { RedisPropagatorService } from "./redis-propagator";
import { SocketStateService } from "./socket-state";


@Module({
    imports: [
        RedisModule
    ],
    providers: [RedisPropagatorService, SocketStateService],
    exports: [RedisPropagatorService]
})
export class RedisSocketModule {

}