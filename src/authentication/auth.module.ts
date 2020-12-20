import { Module } from "@nestjs/common";
import { LocalAuthModule } from "./auth-local";
import { AuthController } from "./auth.controller";


@Module({
    imports: [
        LocalAuthModule
    ],
    controllers: [AuthController]
})
export class AuthModule {
}