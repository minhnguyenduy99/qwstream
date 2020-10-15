import { INestApplicationContext, WebSocketAdapter } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io/adapters/io-adapter";
import { Server, ServerOptions } from "socket.io";
import { RedisPropagatorService } from "../redis-propagator/service";



export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {

    private server: Server;

    constructor(
        private readonly app: INestApplicationContext,
        private readonly redisPropagatorService: RedisPropagatorService
    ) {
        super(app);
    }

    create(port: number, options: ServerOptions = {}): Server {
        this.server = this.createIOServer(port, options);
        this.redisPropagatorService.injectSocketServer(this.server);
        return this.server;
    }
}