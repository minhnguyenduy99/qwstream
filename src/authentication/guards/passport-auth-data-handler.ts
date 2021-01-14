import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { BaseAuthDataHandler } from "src/authorization";


@Injectable()
export class PassportAuthDataHandler extends BaseAuthDataHandler {

    protected getPrincipalId(req: Request) {
        return req.user ? req.user["_id"] : null;
    }
}