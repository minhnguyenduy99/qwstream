

export class RedisSocketEventSendDTO {
    user_id: string;
    socket_id: string;
    data?: any;
    event?: string;
}

export class RedisSocketEventEmitDTO {
    data: unknown;
    event: string;
}

export class RedisSocketRoomEmittedEvent {
    roomId: string;
    event: string;
    data?: any;
    namespace?: string;
}

export class RedisSocketCloseRoomEvent {
    roomId: string;
    namespace?: string;
}