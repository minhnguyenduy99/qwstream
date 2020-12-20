import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { LocalAuthService } from "../local-auth.service";


@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: LocalAuthService
    ) {
        super();
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}