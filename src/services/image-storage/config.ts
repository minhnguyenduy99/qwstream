
export const KEYS = {
    appClientID: "app_client_id",
    defaultAlbumName: "default_album_name",
    config: "service_config",
    storageOptions: "storage_options",
    logger: "logger"
}

export interface ImageStorageConfig {
    albumID: string;
    albumHash: string;
}

export interface StorageOptions {
    albumName: string;
    description?: string;
}

export const ConfigLoader = () => ({
    app_client_id: process.env.IMAGE_STORAGE_CLIENT_ID
})