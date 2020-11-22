import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user-management/core";
import { OfficialConfigLoader } from "./official.config";
import { OfficialAuthController } from "./official.controller";
import { OfficialAuthServices } from "./official.services";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [OfficialConfigLoader] }),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.get("secretKey")
            }),
            imports: [ConfigModule],
            inject: [ConfigService]
        }),
        UserModule
    ],
    exports: [
        OfficialAuthServices
    ],
    providers: [
        OfficialAuthServices
    ],
    controllers: [
        OfficialAuthController
    ]
})

export class OfficialModule {
}