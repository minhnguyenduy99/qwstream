import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { ImageStorageCodes, ImageStorageService } from "@services/image-storage";
import { Model } from "mongoose";
import { KEYS } from "../config";
import { CreateStreamException, StreamModuleException, UpdateStreamException } from "../errors";
import { StreamCategory, StreamInfo } from "../models";
import { CreateStreamInput, CreateStreamOutput, StreamInfoDTO, UpdateStreamInput } from "./dto";



@Injectable()
export class StreamInitService {
    
    protected hlsStreamURL: string;
    constructor(
        private fileStorage: ImageStorageService,
        private configService: ConfigService,
        @InjectModel(StreamCategory.name) private categoryModel: Model<StreamCategory>,
        @InjectModel(StreamInfo.name) private streamModel: Model<StreamInfo>) 
    {
        this.hlsStreamURL = this.configService.get(KEYS.HLS_STREAMING_URL);
    }

    async createStream(channel_id: string, input: CreateStreamInput): Promise<CreateStreamOutput> {
        const cat = await this.canCreateStream(channel_id, input);
        let thumbnail;
        // if thumbnail image is available in the request
        if (input.thumbnail_file) {
            // Upload image
            const uploadResult = await this.fileStorage.uploadImage({
                file: input.thumbnail_file
            });

            if (uploadResult.code === ImageStorageCodes.UPLOAD_IMAGE_FAILED) {
                throw new StreamModuleException("Upload image failed");
            }
            thumbnail = uploadResult.data.url;
        } else {
            // use default thumbnail image from album
            thumbnail = this.fileStorage.getDefaultImage();
        }

        try {
            const stream = await this.streamModel.create({
                stream_title: input.stream_title,
                stream_time_start: Date.now(),
                category: cat.category_id,
                tags: input.tags,
                channel: {
                    channel_id: channel_id
                },
                is_streaming: true,
                view_count: 0,
                thumbnail_url: thumbnail,
                stream_url: null
            });
            return {
                code: 0,
                stream: stream.toObject() as StreamInfoDTO
            }
        } catch (err) {
            throw new CreateStreamException();
        }
    }

    async updateCurrentStream(channelId: string, input: UpdateStreamInput) {
        let stream;
        const category = await this.categoryModel.findOne({
            category_id: input.category_id
        });
        if (!category) {
            throw new UpdateStreamException("Invalid category ID");
        }
        let thumbnail;
        // if thumbnail image is available in the request
        if (input.thumbnail_file) {
            // Upload image
            const uploadResult = await this.fileStorage.uploadImage({
                file: input.thumbnail_file
            });

            if (uploadResult.code === ImageStorageCodes.UPLOAD_IMAGE_FAILED) {
                throw new StreamModuleException("Upload image failed");
            }
            thumbnail = uploadResult.data.url;
        }
        let data = {
            ...input,
            category: category.category_id,
            ...(thumbnail && { thumbnail_url: thumbnail })  
        };
        try {
            stream = await this.streamModel.findOneAndUpdate({
                "channel.channel_id": channelId
            }, data, {
                upsert: false,
                useFindAndModify: false
            });
            return {
                code: 0,
                stream_id: stream._id
            }
        } catch (err) {
            console.log(err);
            throw new UpdateStreamException();
        }
    }

    async updateHLSStreamURL(streamKey: string, streamId: string) {
        const hlsFileURL = `${this.hlsStreamURL}/${streamKey}.m3u8`;
        try {
            await this.streamModel.findOneAndUpdate({
                _id: streamId
            }, {
                stream_url: hlsFileURL
            }, {
                upsert: false,
                useFindAndModify: false
            });
            return hlsFileURL;
        } catch (err) {
            return null;
        }
    }

    protected async canCreateStream(channel_id: string, input: CreateStreamInput) {
        const [cat, stream] = await Promise.all([
            await this.findCategoryById(input.category_id),
            await this.isChannelStreaming(channel_id)
        ]);
        if (!cat) {
            throw new CreateStreamException("Invalid category id");
        }
        if (stream) {
            throw new CreateStreamException("Channel is already streaming");
        }
        return cat;
    }
    
    protected async findCategoryById(categoryId: number) {
        const cat = await this.categoryModel.findOne({
            category_id: categoryId
        });
        return cat;
    }

    protected async isChannelStreaming(channelId: string) {
        const stream = await this.streamModel.findOne({
            "channel.channel_id": channelId,
            is_streaming: true
        });
        return stream;
    }
}