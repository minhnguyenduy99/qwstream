import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { ObjectIdFormat } from "src/helpers/validation";
import { Social } from "./model";

export class CreateChannelInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;

    name?: string;
    bio?: string;
}

export interface CreateChannelOutPut {
    cid: string;
    code?: number;
}

export class UpdateChannelInfoInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    cid: string;

    name?: string;

    bio?: string;

    social?: Social;

    avatar?: string;
}

export interface UpdateChannelInfoOutput {
    code?: number;
}

export interface OnFollowOutput {
    code?: number;
}

export class UploadAvatarInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    cid: string;

    file: any;
}