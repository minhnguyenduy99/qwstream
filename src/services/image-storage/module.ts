import { DynamicModule, HttpModule, Logger, Module, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AlbumService } from "./services/album.service";
import { ConfigLoader, ImageSourceProvider, KEYS, StorageOptions } from "./config";
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
        const { defaultImage } = options ?? {};
        const imports = [];

        const providers = [
            {
                provide: KEYS.storageOptions,
                useValue: options
            },
            ImageStorageService
        ] as Provider<any>[];

        if (defaultImage) {
            providers.push(this.getDefaultImageProvider(defaultImage));
        }
        // get imports from defaultImage
        if (defaultImage) {
            if ("imports" in (defaultImage as any)) {
                imports.push(defaultImage["imports"]);
            }
        }
        return {
            module: ImageStorageModule,
            imports: imports,
            providers,
            exports: [ImageStorageService]
        }
    }

    private static getDefaultImageProvider(image: string | ImageSourceProvider): Provider {
        if ("length" in (image as any)) {
            return {
                provide: KEYS.defaultImage,
                useValue: image
            }
        }
        return {
            provide: KEYS.defaultImage,
            useFactory: image["useFactory"],
            inject: image["inject"]
        }
    } 
}