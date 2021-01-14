

export interface StreamStatsDTO {
    view_count_denta: number;
    hls_stream_url?: string;
}

export interface CreateStreamStatsOutput {
    code: number;
    data?: StreamStatsDTO;
}