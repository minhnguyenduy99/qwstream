import { IsNotEmpty, IsOptional } from "class-validator";


export interface AlbumDTO {
    id: string;
    title: string;
    description: string;
    deletehash: string;
    defaultImage?: string;
}

export interface BasicData {
    id?: string;
    hash?: string;
    url?: string;
}


export class CreateAlbumInput {

    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    default_image?: string;
}

export interface CreateAlbumOutput {
    code: number;
    data: AlbumDTO;
}

export class UploadImageInput {
    file: any;

    @IsOptional()
    name?: string;
}

export interface UploadImageOutput {
    code: number;
    data: BasicData;
} 

export interface DeleteImageOutput {
    code: number;
}

export class ReplaceImageInput {
    
    @IsNotEmpty()
    old_hash: string;

    file: any;

    @IsOptional()
    name?: string;
}

export interface ReplaceImageOutput {
    code: number;
    data: BasicData;
}

export interface GetImageOutput {
    code: number;
    data: BasicData;
}

