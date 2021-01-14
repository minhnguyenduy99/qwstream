import { Socket } from "socket.io";
import { RedisAdapter } from "socket.io-redis";


export interface AuthenticatedStreamSocket extends Socket {
    stream_id: string;
    auth: StreamAuthData;
    redisAdapter?: RedisAdapter;
}

export interface StreamAuthData {
    role: number;
    stream_key: string;
}

