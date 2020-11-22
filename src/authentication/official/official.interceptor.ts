import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class UpdateAccessTokenInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        let request = context.switchToHttp().getRequest();
        if (request.headers.authorization) {
            let response = context.switchToHttp().getResponse();
            response.cookie("access_token", request.headers.authorization);
        }
        return next.handle();
    }
}