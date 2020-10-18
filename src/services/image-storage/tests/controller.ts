import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ReplaceImageInput, UploadImageInput } from "../dto";
import { ImageStorageService } from "../services/image-storage.service";


@Controller("tests/image-storage")
export class ImageStorageController {


    constructor(
        private readonly imageStorage: ImageStorageService
    ) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    uploadImage(@UploadedFile() file: any, @Body() input: UploadImageInput) {
        return this.imageStorage.uploadImage({ file, name: input.name });
    }

    @Get(":id")
    getImage(@Param("id") imageHash: string) {
        return this.imageStorage.getImage(imageHash);
    }

    @Delete(":hash")
    deleteImage(@Param("hash") imageHash: string) {
        return this.imageStorage.deleteImage(imageHash);
    }

    @Put()
    @UseInterceptors(FileInterceptor("file"))
    replaceImage(@UploadedFile() file: any, @Body() input: ReplaceImageInput) {
        return this.imageStorage.replaceImage({
            ...input,
            file: file
        });
    }
}