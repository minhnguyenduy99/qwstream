import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";




@Schema()
export class Profile extends Document {
    
    @Prop()
    display_name: string;

    @Prop()
    gender: string;

    @Prop()
    date_of_birth: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);