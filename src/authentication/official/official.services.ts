import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginUserInput, UserQueryService } from "src/user-management/core";

export const OfficialAuthCode = {
    QUALIFICATION: 0,
    ACCESS_TOKEN_INVALID: -1,
    ACCESS_TOKEN_OUT_OF_DAY: -2,
    REFRESH_TOKEN_INVALID: -3,
}

@Injectable()
export class OfficialAuthServices {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userQueryService: UserQueryService
    ) { }

    async OfficialLogin(input: LoginUserInput) {
        const user = await this.userQueryService.checkLogin(input);
        return {
            access_token: await this.generateAccessToken(user.uid),
            refresh_token: await this.generateRefreshToken(user.uid),
        }
    }

    async generateAccessToken(uid) {
        const access_token = await this.jwtService.sign({ uid: uid, expires: Date.now() + this.configService.get("accessTokenExpires") }, {
            secret: this.configService.get("secretKey")
        });
        return access_token;
    }

    async generateRefreshToken(uid) {
        const refresh_token = await this.jwtService.sign({ uid: uid }, {
            secret: this.configService.get("secretKey"),
            expiresIn: this.configService.get("refreshTokenExpires")
        });
        return refresh_token;
    }

    async checkAccessToken(token, refresh_token) {
        let ret, user
        try {
            ret = await this.jwtService.verifyAsync(token)
            user = this.userQueryService.findUserById(ret.uid)
        } catch (err) {
            return [OfficialAuthCode.ACCESS_TOKEN_INVALID];
        }
        if (!user) {
            return [OfficialAuthCode.ACCESS_TOKEN_INVALID];
        }
        let now = Date.now();
        let newToken = undefined
        if (now > ret.expires) {
            const res = await this.checkRefreshToken(refresh_token);
            if (res === OfficialAuthCode.QUALIFICATION) {
                newToken = await this.generateAccessToken(ret.uid);
            } else {
                return [OfficialAuthCode.REFRESH_TOKEN_INVALID];
            }
        }
        return [OfficialAuthCode.QUALIFICATION, newToken];
    }

    async checkRefreshToken(token) {
        let ret
        try {
            ret = await this.jwtService.verifyAsync(token)
        } catch (err) {
            return OfficialAuthCode.REFRESH_TOKEN_INVALID;
        }
        return OfficialAuthCode.QUALIFICATION;
    }


}