import { Injectable } from "@nestjs/common";
import { RedisPubSubService } from "@services/redis";
import { Server } from "socket.io";
import { RedisSocketCloseRoomEvent, RedisSocketRoomEmittedEvent } from "./dto";

export enum SocketEventType {
    SendEvent,
    EventRoomEmitted,
    CloseRoomEmitted,
    EmitAuthenticatedEvent
}

@Injectable()
export class RedisPropagatorService {

    private socketServer: Server;
    private eventObjects = new Map<SocketEventType, string>([
        [SocketEventType.EventRoomEmitted, "eventRoomEmitted"],
        [SocketEventType.CloseRoomEmitted, "closeRoomEmitted"]
    ])

    constructor(
        private readonly redisService: RedisPubSubService
    ) {
        this.redisService.fromEvent(this.eventObjects[SocketEventType.EventRoomEmitted])
        .subscribe((value) => this.consumeEmitRoomEvent(value as RedisSocketRoomEmittedEvent));

        this.redisService.fromEvent(this.eventObjects[SocketEventType.CloseRoomEmitted])
        .subscribe((value) => this.consumeCloseRoomEvent(value as RedisSocketCloseRoomEvent));
    }

    async propagateToRoom(eventInfo: RedisSocketRoomEmittedEvent) {
        const eventType = this.eventObjects.get(SocketEventType.EventRoomEmitted);
        await this.redisService.publish(eventType, eventInfo);
        return true;
    }

    async closeRoom(eventInfo: RedisSocketCloseRoomEvent) {
        const eventType = this.eventObjects.get(SocketEventType.CloseRoomEmitted);
        await this.redisService.publish(eventType, eventInfo);
    }

    injectSocketServer(server: Server) {
        this.socketServer = server;
    }

    private consumeEmitRoomEvent({ roomId, event, data, namespace }: RedisSocketRoomEmittedEvent) {
        return this.socketServer.of(namespace).to(roomId).emit(event, data);
    }

    private consumeCloseRoomEvent({ roomId, namespace }: RedisSocketCloseRoomEvent) {
        const sockets = this.socketServer.of(namespace).to(roomId).sockets;
        Object.keys(sockets).forEach(id => {
            const socket = sockets[id];
            if (!socket.disconnected)
                socket.disconnect();
        });
    }
}