import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class ImageStorage_Album extends Document {
    
    @Prop({
        required: true,
        unique: true
    })
    album_id: string;

    @Prop({
        required: true,
        unique: true
    })
    delete_hash: string;

    @Prop({
        required: true,
        unique: true
    })
    title: string;

    @Prop({
        required: false,
        default: ""
    })
    description: string;
}

export const AlbumSchema = SchemaFactory.createForClass(ImageStorage_Album);

AlbumSchema.index({
    title: "text"
})