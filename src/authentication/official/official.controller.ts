import { Body, Controller, Post, Res, UseInterceptors } from "@nestjs/common/decorators";
import { Response } from "express";
import { UseFormData } from "src/helpers/interceptors";
import { LoginUserInput } from "src/user-management/core";
import { OfficialAuthServices } from "./official.services";

@Controller('login')
export class OfficialAuthController {
    constructor(
        private readonly officialAuthServices: OfficialAuthServices
    ) { };

    @Post('official-auth')
    @UseFormData()
    async Login(@Body() input: LoginUserInput, @Res() response: Response) {
        const res = await this.officialAuthServices.OfficialLogin(input);
        response.cookie("access_token", res.access_token, {
            httpOnly: true
        });
        response.cookie("refresh_token", res.refresh_token, {
            httpOnly: false
        });
        return response.json({
            code: 0
        });
    }
}