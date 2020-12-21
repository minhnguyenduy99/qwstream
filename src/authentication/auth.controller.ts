import { Controller, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { LocalAuthGuard, LocalAuthService, RefreshTokenGuard } from "./auth-local";
import { UserData } from "./auth-local/local-auth.interfaces";



@Controller("auth")
export class AuthController {

    constructor(
        private readonly localAuthService: LocalAuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post("/login/local")
    @HttpCode(200)
    async localLogin(@Req() req: Request) {
        const user = req.user as UserData;
        const [accessToken, refreshToken] = await Promise.all([
            this.localAuthService.generateAccessToken(user),
            this.localAuthService.generateRefreshToken(user)
        ]);
        req.res.cookie("refresh_token", refreshToken, { httpOnly: true });
        return {
            user: user,
            access_token: accessToken
        };
    }

    @Post("/refresh-token")
    @HttpCode(201)
    @UseGuards(RefreshTokenGuard)
    async refreshAccessToken(@Req() req: Request) {
        const user = req.user as UserData;
        const accessToken = await this.localAuthService.generateAccessToken(user);
        return {
            access_token: accessToken
        }
    }
}