import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { OfficialAuthCode, OfficialAuthServices } from "./official.services";


@Injectable()
export class OfficialAuthGuard implements CanActivate {
    constructor(
        private readonly officialAuthServices: OfficialAuthServices
    ) { }

    async canActivate(context: ExecutionContext) {
        let request = context.switchToHttp().getRequest() as Request;

        if (request.headers.authorization) {
            var ret = await this.officialAuthServices.checkAccessToken(request.headers.authorization, request.cookies["refresh_token"]);
            switch (ret[0]) {
                case OfficialAuthCode.QUALIFICATION:
                    if (ret[1]) {
                        request.headers.authorization = ret[1];
                    }
                    return true;
                case OfficialAuthCode.ACCESS_TOKEN_INVALID: throw new BadRequestException({
                    reason: ret[0],
                    message: "Access token invalid"
                })
                case OfficialAuthCode.REFRESH_TOKEN_INVALID: throw new BadRequestException({
                    reason: ret[0],
                    message: "Session expired"
                })
            }
        } else {
            throw new UnauthorizedException();
        }
    }
}
