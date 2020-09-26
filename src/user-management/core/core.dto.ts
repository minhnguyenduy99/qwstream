import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserInput {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    username: string;

    @IsNotEmpty()
    password: string;
}

export interface CreateUserOutput {
    user_id: string;
    code: number;
    message: string;
}