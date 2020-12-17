import { Body, Controller, Post, UseInterceptors } from "@nestjs/common/decorators";
import { UseFormData } from "src/helpers/interceptors";
import { LoginUserInput } from "src/user-management/core";
import { SetCookieInterceptor } from "./official.interceptor";
import { OfficialAuthServices } from "./official.services";

@Controller('login')
export class OfficialAuthController {
    constructor(
        private readonly officialAuthServices: OfficialAuthServices
    ) { };

    @Post('official-auth')
    @UseFormData()
    @UseInterceptors(SetCookieInterceptor)
    async Login(@Body() input: LoginUserInput) {
        const res = await this.officialAuthServices.OfficialLogin(input);
        return {
            ...res,
            code: 0
        }
    }
}