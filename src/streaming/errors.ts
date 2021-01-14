import { HttpException, HttpStatus } from "@nestjs/common";



export class StreamModuleException extends HttpException {
    
    protected code: number;

    constructor(message = "StreamModule Internal Error", code = 37001, httpCode = HttpStatus.INTERNAL_SERVER_ERROR) {
        super({
            code, 
            message
        }, httpCode);
        this.code = code;
    }
}

export class CreateStreamException extends StreamModuleException {

    constructor(message = "Create stream failed") {
        super(message, 37002, HttpStatus.BAD_REQUEST);
    }
}


export class InvalidStreamKeyInception extends StreamModuleException {

    constructor(message = "Stream key is invalid or expired") {
        super(message, 37002, HttpStatus.UNAUTHORIZED);
    }
}


export class StreamNotExistException extends StreamModuleException {

    constructor() {
        super("Stream not found", 37005, HttpStatus.NOT_FOUND);
    }
}

export class UpdateStreamException extends StreamModuleException {

    constructor(message = "Update stream failed") {
        super(message, 37006, HttpStatus.BAD_REQUEST);
    }
}