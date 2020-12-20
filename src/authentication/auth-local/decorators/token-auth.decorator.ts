import { applyDecorators, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../guards/access-token.guard";
import { RefreshTokenGuard } from "../guards/refresh-token.guard";
import { IsPublic } from "./is-public.decorator";



export const TokenAuthGuard = (isPublic = false) => {
    const decorators = [];
    
    if (isPublic) {
        decorators.push(IsPublic);
    }
    
    decorators.push(UseGuards(
        RefreshTokenGuard,
        AccessTokenGuard
    ));

    return applyDecorators(...decorators);
}