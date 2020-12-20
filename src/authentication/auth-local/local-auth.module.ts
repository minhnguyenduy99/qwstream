import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserManagementModule } from "src/user-management";
import { LocalAuthService } from "./local-auth.service";
import { CONFIG_KEY, LocalAuthConfigLoader } from "./config";
import { EncryptModule } from "src/services/encrypt";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthToken, AuthTokenSchema } from "./auth-token.model";

import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { LocalAuthStrategy } from "./strategies/local-auth.strategy";



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AuthToken.name, schema: AuthTokenSchema }
        ]),
        UserManagementModule,
        PassportModule,
        ConfigModule.forRoot({
            load: [LocalAuthConfigLoader]
        }),
        EncryptModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                const secretKey = config.get(CONFIG_KEY.accessTokenSecretKey);
                const expires = config.get(CONFIG_KEY.accessTokenExpires);
                return {
                    secret: secretKey,
                    signOptions: {
                        expiresIn: expires
                    }
                }
            },
            imports: [ConfigModule],
            inject: [ConfigService]
        })
    ],
    providers: [
        LocalAuthService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        LocalAuthStrategy
    ],
    exports: [LocalAuthService]
})
export class LocalAuthModule {

}