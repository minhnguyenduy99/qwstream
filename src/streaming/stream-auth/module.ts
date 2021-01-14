import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@services/redis";
import { RedisCoreModule } from "src/services/redis-core";
import { configLoader } from "./config";
import { StreamAuthService } from "./service.stream-auth";
import { KEYS } from "./config";


@Module({
    imports: [
        RedisCoreModule.forFeature({
            redis: {
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    return {
                        host: configService.get(KEYS.REDIS_HOST),
                        port: configService.get(KEYS.REDIS_PORT),
                        keyPrefix: "streamauth_"
                    }
                },
                inject: [ConfigService]
            }
        }),
        ConfigModule.forRoot({
            load: [configLoader]
        })
    ],
    providers: [
        StreamAuthService
    ],
    exports: [
        StreamAuthService
    ]
})
export class StreamAuthModule {

}