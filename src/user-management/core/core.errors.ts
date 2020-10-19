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
        super("User not found", HttpStatus.NOT_FOUND);
    }
}

export class UsernameWasTakenException extends CoreModuleException {
    constructor() {
        super("Username was taken", HttpStatus.BAD_REQUEST);
    }
}

export class UserInvalidException extends CoreModuleException {
    constructor() {
        super("Wrong username or password", HttpStatus.BAD_REQUEST);
    }
}

export class WrongPasswordException extends CoreModuleException {
    constructor() {
        super("Wrong password", HttpStatus.BAD_REQUEST);
    }
}

export class ProfileNotFoundException extends CoreModuleException {
    constructor() {
        super("Profile not found", HttpStatus.NOT_FOUND);
    }
}