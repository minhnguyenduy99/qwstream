import { HttpException, HttpStatus } from "@nestjs/common";

// Định nghĩa các exception của module có thể xảy ra

// Nên có 1 base module (như ở đây là `UserModuleException`)

// Trong service nếu cần báo lỗi thì throw exception ra


export class UserModuleException extends HttpException {
    constructor(message: string, code: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(`${message}`, code);
    }
}

export class UserNotFoundException extends UserModuleException {
    constructor() {
        super("User not found", HttpStatus.NOT_FOUND);
    }
}

export class UsernameWasTakenException extends UserModuleException {
    constructor() {
        super("Username was taken", HttpStatus.BAD_REQUEST);
    }
}

export class UserInvalidException extends UserModuleException {
    constructor() {
        super("Wrong username or password", HttpStatus.BAD_REQUEST);
    }
}

export class UserAlreadyFollowedException extends UserModuleException {
    constructor() {
        super("User already followed this channel", HttpStatus.BAD_REQUEST);
    }
}

export class UserNotFollowedException extends UserModuleException {
    constructor() {
        super("User not follow this channel yet", HttpStatus.BAD_REQUEST);
    }
}

export class WrongPasswordException extends UserModuleException {
    constructor() {
        super("Wrong password", HttpStatus.BAD_REQUEST);
    }
}

export class ProfileNotFoundException extends UserModuleException {
    constructor() {
        super("Profile not found", HttpStatus.NOT_FOUND);
    }
}

export class ProfileUploadAvatarException extends UserModuleException {
    constructor(msg = "") {
        super("Upload fail! " + msg, HttpStatus.BAD_REQUEST);
    }
}