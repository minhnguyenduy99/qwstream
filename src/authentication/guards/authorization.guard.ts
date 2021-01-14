import { Injectable } from "@nestjs/common";
import { AuthorizationGuard } from "src/authorization/guards/authorization-guard";
import { PassportAuthDataHandler } from "./passport-auth-data-handler";


@Injectable()
export class PassportAuthorizationGuard extends AuthorizationGuard(PassportAuthDataHandler) {
}