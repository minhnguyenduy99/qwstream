import { HttpException, HttpStatus } from "@nestjs/common";

// Định nghĩa các exception của module có thể xảy ra

// Nên có 1 base module (như ở đây là `CoreModuleException`)

// Trong service nếu cần báo lỗi thì throw exception ra


export class CoreModuleException extends HttpException {
    constructor(message: string, code: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(`[CoreModule] ${message}`, code);
    }
}


export class UserNotFoundException extends CoreModuleException {
    constructor() {
        super("User not found", HttpStatus.BAD_REQUEST);
    }
}