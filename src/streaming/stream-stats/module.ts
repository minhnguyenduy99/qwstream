import { Logger } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisCoreModule } from "src/services/redis-core";
import { CONFIG, ConfigLoader } from "./config";
import { StreamStatsService } from "./service";


@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ConfigLoader]
        }),
        RedisCoreModule.forFeature({
            redis: {
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => {
                    return {
                        host: configService.get(CONFIG.REDIS_HOST),
                        port: configService.get(CONFIG.REDIS_PORT),
                        keyPrefix: "streamstats_"
                    }
                },
                inject: [ConfigService]
            }
        })
    ],
    providers: [
        StreamStatsService,
        {
            provide: Logger,
            useValue: new Logger("StreamStats", true)
        }
    ],
    exports: [
        StreamStatsService
    ]
})
export class StreamStatsModule {
}