import { HttpService, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ImageStorageConfig, KEYS, StorageOptions } from "../config";
import { DeleteImageOutput, GetImageOutput, ReplaceImageInput, UploadImageInput, UploadImageOutput } from "../dto";
import { ImageStorageCodes } from "../image-storage-codes";
import { AlbumService } from "./album.service";


@Injectable()
export class ImageStorageService implements OnModuleInit {

    protected config: ImageStorageConfig;
    
    constructor(
        @Inject(KEYS.appClientID) private readonly clientId: string,
        @Inject(KEYS.storageOptions) private readonly storageOptions: StorageOptions,
        private readonly albumService: AlbumService,
        private readonly httpService: HttpService,
        private readonly logger: Logger
    ) {

    }

    async onModuleInit() {
        const { albumName, description = "" } = this.storageOptions;
        const createAlbum = await this.albumService.createAlbum({
            name: albumName,
            description: description
        });
        if (createAlbum.code === ImageStorageCodes.CREATE_ALBUM_FAILED) {
            this.logger.error("Create album failed: " + albumName);
            return;
        }
        const album = createAlbum.data;
        this.logger.log("Create album: " + albumName);
        this.config = {
            albumHash: album.deletehash,
            albumID: album.id
        }
    }
    

    async uploadImage({ file, name }: UploadImageInput): Promise<UploadImageOutput> {
        try {
            const { data } = await this.httpService.post("https://api.imgur.com/3/image", {
                image: Buffer.from(file.buffer).toString("base64"),
                album: this.config.albumHash,
                type: "base64",
                name: name
            }, {
                headers: this.headers()
            }).toPromise();
            if (!data.success) {
                return {
                    code: ImageStorageCodes.UPLOAD_IMAGE_FAILED,
                    data: null
                }
            }
            const { data: image } = data; 
            return {
                code: ImageStorageCodes.SUCCESS,
                data: {
                    id: image.id,
                    hash: image.deletehash,
                    url: image.link
                }
            }
        } catch (error) {
            return {
                code: ImageStorageCodes.UPLOAD_IMAGE_FAILED,
                data: null
            }
        }
    }

    async getImage(imageId: string): Promise<GetImageOutput> {
        try {
            const { status, data } = await this.httpService.get(`https://api.imgur.com/3/image/${imageId}`, {
                headers: this.headers()
            }).toPromise();

            if (status === HttpStatus.NOT_FOUND) {
                return {
                    code: ImageStorageCodes.IMAGE_NOT_FOUND,
                    data: null
                }
            }
            const { data: image } = data; 
            console.log(image);
            return {
                code: ImageStorageCodes.SUCCESS,
                data: {
                    id: image.id,
                    url: image.link,
                    hash: image.deletehash
                }
            }
        } catch (err) {
            return {
                code: ImageStorageCodes.IMAGE_NOT_FOUND,
                data: null
            }
        }
    }

    async deleteImage(imageHash: string): Promise<DeleteImageOutput> {
        try {
            const { data } = await this.httpService.delete(`https://api.imgur.com/3/image/${imageHash}`, {
                headers: this.headers()
            }).toPromise();
            if (!data.success) {
                return {
                    code: ImageStorageCodes.DELETE_IMAGE_FAILED
                }
            }
            return {
                code: ImageStorageCodes.SUCCESS
            }
        } catch (err) {
            return {
                code: ImageStorageCodes.DELETE_IMAGE_FAILED
            }
        }
    }

    async replaceImage({ file, name, old_hash }: ReplaceImageInput) {
        const deleteImage = await this.deleteImage(old_hash);
        if (deleteImage.code === ImageStorageCodes.DELETE_IMAGE_FAILED) {
            return deleteImage;
        }
        const uploadImage = await this.uploadImage({ file, name });
        return uploadImage;
    }

    headers() {
        return {
            Authorization: `Client-ID ${this.clientId}`
        }
    }

    protected printResponseError({ response: { data, status } }) {
        const message = data.data.error || data.data.error.message;
        const errorMsg = `[${status}] Error: ${message}`;
        this.logger.error(errorMsg);
    }
}