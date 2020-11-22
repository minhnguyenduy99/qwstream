import { IsNotEmpty, IsString, Validate } from "class-validator";
import { ObjectIdFormat } from "src/helpers/validation";

export class CreateProfileInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;
}

export interface CreateProfileOutput {
    code?: number;
}

export class UpdateProfileInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;

    nickname?: string;
    gender?: number;
    day_of_birth?: number;
    avatar?: string;
}

export interface UpdateProfileOutput {
    avatar: any;
    code?: number;
}

export class FindProfileInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;
}

export interface FindProfileOutput {
    pid: string
    nickname: string;
    gender: number;
    day_of_birth: number;
}

export class UploadAvatarInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;

    file: any;
}