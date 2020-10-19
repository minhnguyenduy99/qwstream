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
}

export interface UpdateProfileOutput {
    code?: number;
}

export class FindProfileInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;
}

export interface FindProfileOutput {
    nickname: string;
    gender: number;
    day_of_birth: number;
}