import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";

@Injectable()
export class UpdateAccessTokenInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler) {

        const observable = next.handle().pipe(
            map(data => {
                let request = context.switchToHttp().getRequest();
                if (request.headers.authorization) {
                    let response = context.switchToHttp().getResponse();
                    response.cookie("access_token", request.headers.authorization);
                }
                return data;
            })
        );
        return observable;
    }
}

export class SetCookieInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(data => {
                const response = context.switchToHttp().getResponse() as Response;
                response.cookie("access_token", data.access_token);
                response.cookie("refresh_token", data.refresh_token, {
                    secure: true,
                    httpOnly: true
                });
                delete data.refresh_token;
                return data;
            })
        )
    }
}