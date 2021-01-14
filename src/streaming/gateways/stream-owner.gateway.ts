import { Inject, Logger, UseFilters, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { STREAMING_NAMESPACES } from "./namespaces";
import { StreamStatsService, STREAM_STATS_CODES } from "../stream-stats";
import { AuthenticatedStreamSocket, AUTH_RESULTS, SocketStreamAuthGuard, StreamAuthService } from "../stream-auth";
import { OnEvent } from "@nestjs/event-emitter";
import { STREAM_EVENTS } from "../consts";
import { SOCKET_STREAM_EVENTS } from "./socket-events";
import { KEYS } from "../config";
import { WsExceptionsFilter } from "src/helpers/exception-filters";

@WebSocketGateway({
    namespace: STREAMING_NAMESPACES.STREAM_OWNER
})
@UseFilters(WsExceptionsFilter)
export class StreamOwnerGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly streamStatsService: StreamStatsService,
        private readonly streamAuthService: StreamAuthService,
        @Inject(KEYS.LOGGER) private readonly logger: Logger
    ) {
    }

    async handleDisconnect(
        @ConnectedSocket() client: AuthenticatedStreamSocket) {
        client.leaveAll();
        this.logger.log(`${client.id} has disconnected to the stream owner`);
    }

    afterInit(server: any) {
        this.logger.log(`Socket open at port 3001`);
    }

    async handleConnection(client: Socket, data: any = {}) {
        this.logger.log(`${client.id} has connected to the stream owner`);
    }

    @SubscribeMessage(SOCKET_STREAM_EVENTS.CONNECT_STREAM)
    @UseGuards(SocketStreamAuthGuard)
    async onConnectStream(client: AuthenticatedStreamSocket) {
        const { stream_id } = client;
        client.join(stream_id, (err) => {
            if (err) {
                this.logger.error(err);
            }
        });
        const stats = await this.streamStatsService.getStats(stream_id);
        this.logger.log(`[${STREAMING_NAMESPACES.STREAM_OWNER}/room:${stream_id}] Connected: ${client.id}`);
        return {
            is_connected: true,
            ...stats
        }
    }

    @OnEvent(STREAM_EVENTS.STREAM_ESTABLISHED, { async: true })
    async onStreamEstablished(stream_id: string) {
        this.logger.debug(`[${this.constructor.name}] Stream is established`);
        this.server.emit(SOCKET_STREAM_EVENTS.STREAM_ESTABLISHED, { stream_id });
    }
}