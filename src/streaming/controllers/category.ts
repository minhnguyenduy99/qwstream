import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { StreamCategoryService } from "../services";



@Controller("stream-categories")
export class StreamCategoryController {

    constructor(
        private readonly categoryService: StreamCategoryService
    ) {}

    @Get()
    @HttpCode(200)
    findAllCategories() {
        return this.categoryService.findAllCategories();
    }

    @Post()
    createCategories(@Body() { categories = [] }: any) {
        return this.categoryService.createCategories(categories);
    }
}