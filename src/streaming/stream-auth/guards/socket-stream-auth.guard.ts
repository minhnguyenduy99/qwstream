import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { StreamAuthService } from "../service.stream-auth";
import { AUTH_RESULTS, STREAM_ROLES } from "../consts";
import { StreamAuthData } from "../sockets/interfaces";
import { WsException } from "@nestjs/websockets";


@Injectable()
export class SocketStreamAuthGuard implements CanActivate {
    
    constructor(
        private readonly authService: StreamAuthService
    ) {}
    
    async canActivate(context: ExecutionContext) {
        const socket = context.switchToWs();
        const data = socket.getData();
        const client = socket.getClient();
        if (!data) {
            throw new WsException("Unauthorized access");
        }
        const { stream_key, stream_id } = data;
        const result = await this.authService.vertifyStreamKey(stream_key, stream_id);
        console.log("StreamAuth");
        switch (result.code) {
            case AUTH_RESULTS.KEY_EXPIRED:
            case AUTH_RESULTS.INVALID_STREAM_ID:
                console.log("Error");
                throw new WsException("Unauthorized access");
            case AUTH_RESULTS.VALID:
                client.stream_id = stream_id;
                client.auth = {
                    stream_key: stream_key,
                    role: STREAM_ROLES.owner
                } as StreamAuthData;
                return true;
        }
    }
}