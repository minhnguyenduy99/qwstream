import { INestApplication } from "@nestjs/common";
import { RedisPropagatorService } from "../redis-propagator/service";
import { SocketStateAdapter } from "./adapter";



export const initAdapter = (app: INestApplication): INestApplication => {
    const propagatorService = app.get(RedisPropagatorService);
    app.useWebSocketAdapter(new SocketStateAdapter(app, propagatorService));
    return app;
}