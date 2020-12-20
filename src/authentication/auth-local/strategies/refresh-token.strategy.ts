import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { LocalAuthService } from "../local-auth.service";
import { CONFIG_KEY } from "../config";
import { RefreshTokenPayload } from "../local-auth.interfaces";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenInvalid } from "../errors";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
    constructor(
        private localAuthService: LocalAuthService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => req.cookies["refresh_token"]
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get(CONFIG_KEY.refreshTokenSecretKey)
        });
    }

    async validate(payload: RefreshTokenPayload) {
        const user = await this.localAuthService.validateRefreshTokenPayload(payload);
        if (!user) {
            throw new RefreshTokenInvalid();
        }
        return user;
    }
}