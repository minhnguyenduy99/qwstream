import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface Social {
    facebook?: string;
    instagram?: string;
}

@Schema()
export class Channel extends Document {
    /**
     * id owner
     */
    @Prop({
        required: true,
    })
    uid: string;

    @Prop()
    name: string;

    @Prop({
        default: ""
    })
    bio: string;

    @Prop(raw({
        facebook: { type: String },
        instagram: { type: String },
        default: {}
    }))
    social: Record<string, any>;

    @Prop({
        default: 0
    })
    count: number;

    @Prop({
        type: [String],
        default: []
    })
    followers: string[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
ChannelSchema.index({
    name: "text"
})