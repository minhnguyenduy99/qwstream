
export interface StreamAuth {
    /**
     * The stream ID to publish
     */
    stream_id: string;

    /**
     * The secret key that allows the connection to stream server
     */
    key: string;
}

export interface StreamAuthFactory {
    getBody(req: any): StreamAuth | Promise<StreamAuth>;
}