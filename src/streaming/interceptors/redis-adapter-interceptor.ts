import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


@Injectable()
export class RedisAdapterInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const socket = context.switchToWs().getClient();
        console.log(socket);
        socket.redisAdapter = socket.adapter;
        return next.handle();
    }
}