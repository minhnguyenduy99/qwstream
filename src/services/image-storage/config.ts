import { ModuleMetadata } from "@nestjs/common"

export const KEYS = {
    appClientID: "app_client_id",
    defaultAlbumName: "default_album_name",
    config: "service_config",
    storageOptions: "storage_options",
    logger: "logger",
    defaultImage: "default_image",
    rootDir: "ROOT_DIR"
}

export interface ImageStorageConfig {
    albumID: string;
    albumHash: string;
}

export interface StorageOptions {
    albumName: string;
    description?: string;
    defaultImage?: string | ImageSourceProvider;
}

export interface ImageSourceProvider extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => string | Promise<string>;
    inject?: any[];
}

export const ConfigLoader = () => ({
    app_client_id: process.env.IMAGE_STORAGE_CLIENT_ID
})