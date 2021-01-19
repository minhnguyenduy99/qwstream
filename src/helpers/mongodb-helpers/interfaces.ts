import { Model } from "mongoose";



export interface LookupOptions extends BaseLookupOptions {
    localField: string;
    foreignField: string;
    single?: boolean;
    removeFields?: string[]
}

export interface PipelineLookupOptions extends BaseLookupOptions {
    pipeline: any[];
}

interface BaseLookupOptions {
    from: Model<any>,
    as: string;
}