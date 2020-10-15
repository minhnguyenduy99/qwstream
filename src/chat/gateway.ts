import { Logger, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { RedisPropagatorService } from "@services/redis-socket";

import { AuthenticatedSocket } from "./auth/auth-socket";
import { MessageSentInput } from "./dto";
import { ChatService } from "./services/service.chat";
import { InvalidEventEmissionException } from "./errors";
import { SocketAuthGuard } from "./auth/auth-guard";

const CHAT_NAMESPACE = "/chat";

@WebSocketGateway({
    path: CHAT_NAMESPACE
})
@UseGuards(SocketAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

    private logger: Logger = new Logger("StreamingGateway");

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly redisPropagatorService: RedisPropagatorService,
        private readonly chatService: ChatService
    ) {
    }

    @SubscribeMessage("messageSent")
    async onMessageSent(client: AuthenticatedSocket, { room_id, message }: MessageSentInput) {
        await this.redisPropagatorService.propagateToRoom({
            roomId: room_id,
            event: "newMessage",
            data: {
                user_name: client.auth.user_name,
                message: message,
                time_stamp: Date.now()
            }
        });
    }

    handleConnection(client: AuthenticatedSocket) {
        const userId = client.auth.user_id;
        this.logger.log(`Client connected: ${userId}`);
    }
    
    async handleDisconnect({ auth, ticket }: AuthenticatedSocket) {
        const { user_id } = auth;
        const leaveResult = await this.chatService.leaveRoom(ticket);
        if (!leaveResult) {
            this.logger.error(`Ticket is invalid for user ${user_id}`);
            return;
        }
    }

    async onChatRoomClosed({ auth }: AuthenticatedSocket) {
        const { is_host, room_id } = auth;
        if (is_host) {
            await this.redisPropagatorService.closeRoom({
                namespace: CHAT_NAMESPACE,
                roomId: room_id
            });
            this.logger.log(`Room was closed: ${room_id}`);
        } else {
            throw new InvalidEventEmissionException();
        }
    }

    afterInit() {
        this.logger.log("Init");
    }
}