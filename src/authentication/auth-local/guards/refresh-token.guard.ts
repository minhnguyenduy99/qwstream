import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_DECORATOR } from "../consts";


@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh-token") {

    constructor(
        private reflector: Reflector
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_DECORATOR, [
            context.getHandler(),
            context.getClass()
        ]);
        
        if (isPublic) {
            return true;
        }
        
        return super.canActivate(context);
    }
}