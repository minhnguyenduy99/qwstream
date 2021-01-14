import { IsIn, IsNumber } from "class-validator";


export class GetCurrentChannelStreamQuery {

    @IsNumber()
    @IsIn([0, 1])   // 1 means include the lastest stream (if have) or 0, otherwise.
    latest: number;
}