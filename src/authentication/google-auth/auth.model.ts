import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class GoogleAuth extends Document {
  
  @Prop({
    unique: true
  })
  auth_id: string;

  @Prop()
  refresh_token: string;

  @Prop()
  expired_date: number;
}


export const GoogleAuthSchema = SchemaFactory.createForClass(GoogleAuth);