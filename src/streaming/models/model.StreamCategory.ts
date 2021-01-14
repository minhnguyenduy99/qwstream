import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { save_generateIDMiddleware, insertMany_generateIDMiddleware } from "src/services/id-generator";


@Schema()
export class StreamCategory extends Document {

    @Prop({
        unique: true
    })
    category_id?: number;

    @Prop({
        required: true,
        unique: true
    })
    category_name: string;
}

export const StreamCategorySchema = SchemaFactory.createForClass(StreamCategory);

StreamCategorySchema.pre("save", save_generateIDMiddleware("category_id", "StreamCategory"));
StreamCategorySchema.pre("insertMany", insertMany_generateIDMiddleware("category_id", "StreamCategory"));