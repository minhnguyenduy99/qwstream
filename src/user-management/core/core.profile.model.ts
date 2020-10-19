import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Profile extends Document {
    @Prop({
        required: true
    })
    uid: string;
    
    @Prop()
    nickname: string;

    @Prop({
        default: 0
    })
    gender: number;

    @Prop({
        default: 0
    })
    date_of_birth: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);