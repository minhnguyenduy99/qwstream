import { CreateStreamStatsOutput, StreamStatsDTO } from "./dto";


export interface IStreamStatsService {
    createStats(streamId: string, streamStats: StreamStatsDTO): Promise<CreateStreamStatsOutput>;
    updateStats(streamId: string, updateStats: StreamStatsDTO): Promise<void>;
    deleteStats(streamId: string): Promise<boolean>;
}

export interface AdapterOptions {
    intervalTime: number;
}