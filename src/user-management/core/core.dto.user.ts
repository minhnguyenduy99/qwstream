import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { ObjectIdFormat } from "src/helpers/validation";

export class CreateUserInput {

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string;
}

export interface CreateUserOutput {
    uid: string;
    code?: number;
}

export class LoginUserInput {

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string;
}

export interface LoginUserOutput {
    code?: number;
}

export class UpdatePasswordInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    newPassword: string;
}

export interface UpdatePasswordOutput {
    code?: number;
}

export class GetOnlineStatusInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;
}

export interface GetOnlineStatusOutput {
    onlineStatus: number;
    code?: number;
}

export class UpdateOnlineStatusInput {
    @IsString()
    @IsNotEmpty()
    @Validate(ObjectIdFormat)
    uid: string;

    @IsNotEmpty()
    onlineStatus: number;
}

export interface UpdateOnlineStatusOutput {
    code?: number
}