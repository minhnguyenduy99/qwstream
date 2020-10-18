import { DynamicModule, HttpModule, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AlbumService } from "./services/album.service";
import { ConfigLoader, KEYS, StorageOptions } from "./config";
import { ImageStorageService } from "./services/image-storage.service";
import { ImageStorageController } from "./tests/controller";
import { MongooseModule } from "@nestjs/mongoose";
import { AlbumSchema, ImageStorage_Album } from "./models/album.model";


@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            load: [ConfigLoader]
        }),
        MongooseModule.forFeature([
            { name: ImageStorage_Album.name, schema: AlbumSchema }
        ])
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("ImageStorageModule")
        },
        {
            provide: KEYS.appClientID,
            useFactory: (configService: ConfigService, logger: Logger) => {
                const clientId = configService.get(KEYS.appClientID);
                if (!clientId) {
                    logger.error("Client ID not found");
                }
                return clientId;
            },
            inject: [ConfigService, Logger]
        },
        AlbumService,
        ImageStorageController
    ],
    exports: [ImageStorageController]
})
export class ImageStorageModule {


    static forFeature(options: StorageOptions): DynamicModule {
        return {
            module: ImageStorageModule,
            providers: [
                {
                    provide: KEYS.storageOptions,
                    useValue: options
                },
                ImageStorageService
            ],
            exports: [ImageStorageService]
        }
    }
}