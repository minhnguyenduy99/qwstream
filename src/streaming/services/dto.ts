import { Expose, Transform } from "class-transformer";
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";


export class CreateStreamInput {

    @IsNotEmpty()
    stream_title: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val))
    category_id: number;

    @IsArray()
    @IsOptional()
    tags: string[];

    @IsOptional()
    thumbnail_file?: any;
}

export class UpdateStreamInput {

    @IsNotEmpty()
    @IsOptional()
    stream_title: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val))
    @IsOptional()
    category_id: number;

    @IsArray()
    @IsOptional()
    tags: string[];

    @IsOptional()
    thumbnail_file?: any;
}

export interface CreateStreamOutput {
    code: number;
    stream: StreamInfoDTO;
}

export class StreamKeyAuthInput {

    @IsNotEmpty()
    stream_key: string;
}

export class StreamSearchInput {
    @IsOptional()
    @Transform((val) => {
        if (!val) return null;
        return Number.parseInt(val);
    })

    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Expose({
        name: "category-id"
    })
    category_id?: number;
    
    @IsNotEmpty()
    @Expose({ name: "value"})
    @IsNotEmpty()
    search_value: string;

    @IsOptional()
    @IsIn(["current", "old"])
    @IsNotEmpty()
    type?: "current" | "old";
}

export class StreamWithSortedInput {

    @IsOptional()
    @IsIn(["current", "old"])
    @IsNotEmpty()
    type?: "current" | "old";

    @IsOptional()
    @Transform(val => {
        if (!val) return null;
        return Number.parseInt(val);
    })
    @IsIn([-1, 0, 1])
    @Expose({
        name: "sort-by-view"
    })
    sortByView: number;

    @IsOptional()
    @Transform(val => {
        if (!val) return null;
        return Number.parseInt(val);
    })
    @IsIn([-1, 0, 1])
    @Expose({
        name: "sort-by-time"
    })
    sortByTime: number;
}
export class GetChannelOldStreamingInput {
    @IsIn([-1, 1])
    @IsOptional()
    sortByTime?: number;

    @IsIn([-1, 1])
    @IsOptional()
    sortByViews?: number;
}

export interface GetChannelOldStreamingOutput {
    results: StreamInfoDTO[];
    next: string;
    count: number;
}

export interface StreamPaginationOutput {
    count: number;
    next: string;
    results: StreamInfoDTO[];
    search?: any;
}

export interface StreamSearchOutput {
    search: string;
    current: CurrentStreamSearchOutput;
    old: OldStreamSearchOutput;
}

export interface CurrentStreamSearchOutput {
    count: number;
    next: string;
    results: StreamInfoDTO[];
}

export interface OldStreamSearchOutput {
    count: number;
    next: string;
    results: StreamInfoDTO[];
}

export interface ChannelCurrenttStreamingOutput {
    is_streaming: boolean;
    latest?: StreamInfoDTO;
    current: StreamInfoDTO;
}


export interface StreamInfoDTO {
    _id: string;
    channel?: {
        channel_id?: string;
        channel_name: string;
    }
    category?: {
        category_id?: number;
        category_name?: string;
    }
    stream_title: string;
    stream_time_start: number;
    stream_duration: number;
    is_streaming: boolean;
    thumbnail_url: string;
}