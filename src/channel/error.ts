import { HttpException, HttpStatus } from "@nestjs/common";

export class ChannelModuleException extends HttpException {
    constructor(message: string, code: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(`[ChannelModule] ${message}`, code);
    }
}

export class ChannelNotFoundException extends ChannelModuleException {
    constructor() {
        super("Channel not found", HttpStatus.NOT_FOUND);
    }
}