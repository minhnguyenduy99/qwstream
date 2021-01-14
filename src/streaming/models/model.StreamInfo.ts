import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class StreamInfo extends Document {

    @Prop({
        required: true
    })
    stream_title: string;

    @Prop({
        required: true,
        indexes: [-1]
    })
    stream_time_start: number;

    @Prop({
        required: false
    })
    stream_duration?: number;

    @Prop(raw({
        channel_id: { type: String },
        channel_name: { type: String }
    }))
    channel: Record<string, any>;

    @Prop({
        required: false,
        default: null
    })
    thumbnail_url: string;

    @Prop(raw({
        category_id: { type: Number },
        category_name: { type: String },
    }))
    category: Record<string, any>;

    @Prop({
        type: [String],
        default: []
    })
    tags: string[];

    @Prop({
        required: false,
        default: true
    })
    is_streaming: boolean;

    @Prop({
        required: false,
        default: 0
    })
    view_count: number;

    @Prop()
    stream_url: string;

    get stream_id(): string {
        return this._id;
    }
}

export const StreamInfoSchema = SchemaFactory.createForClass(StreamInfo);

StreamInfoSchema.virtual("stream_id").get(function() {
    return this._id;
})

StreamInfoSchema.index(
    {
        is_streaming: 1,
        "category.category_id": 1,
        stream_time_start: -1
    }
)

StreamInfoSchema.index(
    {
        "channel.channel_id": 1
    }
)


StreamInfoSchema.index(
    {
        stream_time_start: -1,
        view_count: -1,
    }
)


StreamInfoSchema.index(
    {
        stream_title: "text",
        "category.category_name": "text"
    }
)