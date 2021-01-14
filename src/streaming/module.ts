import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "src/app.service";
import { PaginationModule } from "src/helpers/pagination";
import { ImageStorageModule } from "src/services/image-storage";
import { ConfigLoader, KEYS, PaginationConfig } from "./config";
import { ChannelStreamViewController, GlobalStreamController, StreamCategoryController } from "./controllers";
import { StreamStatsController } from "./controllers/stream-stats.test";
import { StreamOwnerGateway } from "./gateways/stream-owner.gateway";
import { StreamCategory, StreamCategorySchema, StreamInfo, StreamInfoSchema } from "./models";
import { GlobalStreamViewService, ChannelStreamViewService, StreamInitService, StreamCategoryService } from "./services";
import { StreamAuthModule } from "./stream-auth";
import { StreamStatsModule } from "./stream-stats";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ConfigLoader]
        }),
        MongooseModule.forFeature([
            { name: StreamCategory.name, schema: StreamCategorySchema },
            { name: StreamInfo.name, schema: StreamInfoSchema }
        ]),
        PaginationModule,
        ImageStorageModule.forFeature({
            albumName: "StreamingAlbum",
            defaultImage: {
                useFactory: (appService: AppService) => {
                    return `${appService.publicURL}/images/default_livestream_thumbnail.jpg`;
                },
                inject: [AppService]
            }
        }),
        StreamStatsModule,
        StreamAuthModule
    ],
    providers: [
        {
            provide: KEYS.LOGGER,
            useValue: new Logger("StreamingModule")
        },
        {
            provide: KEYS.PAGINATION,
            useFactory: (configService: ConfigService) => {
                const host = configService.get("HOST");
                const port = configService.get("PORT");
                const channelPaginationRoute = configService.get(KEYS.CHANNEL_STREAM_PAGINATION_URL);
                const globalPaginationRoute = configService.get(KEYS.GLOBAL_STREAM_PAGINATION_URL); 
                const domain = `${host}:${port}`;
                return {
                    channelStreamPaginationURL: !channelPaginationRoute ? domain : `${domain}/${channelPaginationRoute}`,
                    globalStreamPaginationURL: !globalPaginationRoute ? domain : `${domain}/${globalPaginationRoute}`
                } as PaginationConfig;
            },
            inject: [ConfigService]
        },
        GlobalStreamViewService,
        ChannelStreamViewService,
        StreamInitService,
        StreamCategoryService,
        // Gateways
        StreamOwnerGateway
    ],
    controllers: [ChannelStreamViewController, GlobalStreamController, StreamCategoryController, StreamStatsController]
})
export class StreamingModule {
}