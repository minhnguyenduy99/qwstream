import { CanActivate, ExecutionContext, Inject, Injectable, Optional, UnauthorizedException } from "@nestjs/common";
import { MODULE_KEYS } from "../consts";
import { PrincipalHandler } from "../interfaces";
import { AuthorizationService } from "../services/authorization.service";

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        private readonly authorizationService: AuthorizationService,
        @Inject(MODULE_KEYS.PrincipalHandler) private readonly principalHandler: PrincipalHandler
    ) {

    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authData = await Promise.resolve(this.principalHandler.getPrincipal(context));

        // The route is not guarded
        if (!authData) {
            return true;
        }

        const allowed = await this.authorizationService.authorize(authData.type, authData);

        if (!allowed) {
            throw new UnauthorizedException();
        }
        
        req.authorization = authData;
        return true;
    }
}