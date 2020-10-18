import { HttpService, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { KEYS } from "../config";
import { AlbumDTO, CreateAlbumInput, CreateAlbumOutput } from "../dto";
import { ImageStorageCodes } from "../image-storage-codes";
import { ImageStorage_Album } from "../models/album.model";


@Injectable()
export class AlbumService {
    
    constructor(
        @Inject(KEYS.appClientID) private readonly clientId: string,
        @InjectModel(ImageStorage_Album.name) private readonly albumModel: Model<ImageStorage_Album>,
        private readonly logger: Logger,
        private readonly httpService: HttpService
    ) {

    }

    async createAlbum({ name, description = name }: CreateAlbumInput): Promise<CreateAlbumOutput> {
        let album = await this.findAlbum(name);
        if (album) {
            return {
                code: 0,
                data: this.modelToAlbumDTO(album)
            }
        }
        const { data } = await this.httpService.post("https://api.imgur.com/3/album", {
            title: name,
            description: description
        }, {
            headers: this.headers()
        }).toPromise();

        if (!data.success) {
            return {
                code: ImageStorageCodes.CREATE_ALBUM_FAILED,
                data: null
            }
        }
        const albumDTO = {
            ...data.data,
            title: name,
            description: description
        } as AlbumDTO;
        album = await this.saveAlbum(albumDTO);
        return {
            code: ImageStorageCodes.SUCCESS,
            data: this.modelToAlbumDTO(album)
        }
    }

    async findAlbum(idOrHashorTitle: string) {
        const album = await this.albumModel.findOne({
            $or: [
                { album_id: idOrHashorTitle },
                { delete_hash: idOrHashorTitle },
                { title: idOrHashorTitle }
            ]
        });
        return album;
    }

    protected async saveAlbum({ id, title, description, deletehash }: AlbumDTO) {
        try {
            const album = await this.albumModel.create({
                album_id: id,
                delete_hash: deletehash,
                title,
                description
            });
            return album;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    protected headers() {
        return {
            Authorization: `Client-ID ${this.clientId}`
        }
    }

    protected modelToAlbumDTO(model: ImageStorage_Album): AlbumDTO {
        return {
            id: model.album_id,
            deletehash: model.delete_hash,
            title: model.title,
            description: model.description
        }
    }
}