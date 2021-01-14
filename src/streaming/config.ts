
export const KEYS = {
    PAGINATION: "PAGINATION",
    CHANNEL_STREAM_PAGINATION_URL: "CHANNEL_STREAM_PAGINATION_URL",
    GLOBAL_STREAM_PAGINATION_URL: "GLOBAL_STREAM_PAGINATION_URL",
    LOGGER: "LOGGER",
    HLS_STREAMING_URL: "HLS_STREAMING_URL"
}

export interface PaginationConfig {
    channelStreamPaginationURL: string;
    globalStreamPaginationURL: string;
}


export const ConfigLoader = () => ({
    STREAM_PAGINATION_URL: process.env.CHANNEL_STREAM_PAGINATION_URL || "",
    GLOBAL_STREAM_PAGINATION_URL: process.env.GLOBAL_STREAM_PAGINATION_URL || "",
    [KEYS.HLS_STREAMING_URL]: process.env.HLS_STREAMING_URL
})