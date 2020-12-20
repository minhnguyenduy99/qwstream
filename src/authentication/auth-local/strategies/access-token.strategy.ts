import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { LocalAuthService } from "../local-auth.service";
import { CONFIG_KEY } from "../config";
import { AccessTokenPayload } from "../local-auth.interfaces";
import { ConfigService } from "@nestjs/config";
import { AccessTokenInvalid } from "../errors";


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access-token") {
    constructor(
        private localAuthService: LocalAuthService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get(CONFIG_KEY.accessTokenSecretKey)
        });
    }

    async validate(payload: AccessTokenPayload) {
        const user = await this.localAuthService.validateAccessTokenPayload(payload);
        if (!user) {
            throw new AccessTokenInvalid();
        }
        return user;
    }
}