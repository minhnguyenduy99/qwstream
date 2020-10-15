import { HttpException, HttpStatus } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";



export class ChatSocketModuleException extends WsException {
    
    constructor(code = 23001, error = "Errors occured") {
        super({ code, error })
    }
}


export class InvalidRoomIdException extends ChatSocketModuleException {
    constructor() {
        super(23002, "Invalid chat room id");
    }
}

export class InvalidEventEmissionException extends ChatSocketModuleException {
    constructor() {
        super(23003, "Invalid event emission");
    }
}


export class ChatModuleException extends HttpException {
    constructor(code = 23010, message = "Errors occured", status = HttpStatus.INTERNAL_SERVER_ERROR) {
        super({
            code, message
        }, status);
    }
}


export class InvalidTicketException extends ChatModuleException {
    constructor() {
        super(23011, "Invalid room ticket", HttpStatus.FORBIDDEN);
    }
}

export class UnauthenticatedSocket extends ChatModuleException {

    constructor() {
        super(23012, "Unauthenticated socket", HttpStatus.FORBIDDEN);
    }
}