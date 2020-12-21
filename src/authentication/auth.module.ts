import { DynamicModule } from "@nestjs/common";
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

    static useGlobal(): DynamicModule {
        return {
            global: true,
            module: AuthModule
        }
    }
}