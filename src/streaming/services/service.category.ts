import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { StreamCategory } from "../models";
import { KEYS } from "../config";


@Injectable()
export class StreamCategoryService {
    
    constructor(
        @InjectModel(StreamCategory.name) private readonly categoryModel: Model<StreamCategory>,
        @Inject(KEYS.LOGGER) private readonly logger: Logger
    ) {}
    
    async findAllCategories() {
        const categories = await this.categoryModel.find();
        return categories;
    }

    async createCategories(categories: string[] | string) {
        if (typeof categories === "string") {
            try {
                const result = await this.categoryModel.create({
                    category_name: categories
                });
                return {
                    success: 1,
                    data: result
                };
            } catch (err) {
                return { 
                    success: 0
                }
            }
        }
        const data = categories.map(category => ({
            category_name: category
        }));
        try {
            await this.categoryModel.insertMany(data, { 
                ordered: false
            });
            return {
                success: 1
            }
        } catch (err) {
            return {
                success: 0
            }
        }
    }
}