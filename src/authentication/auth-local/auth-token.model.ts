import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class AuthToken extends Document {

    @Prop({
        required: true,
        unique: true
    })
    user_id: string;

    @Prop()
    hash_refresh_token: string;
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);