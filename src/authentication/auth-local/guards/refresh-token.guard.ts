
import { Injectable } from "@nestjs/common";
import { BaseLocalAuthGuard } from "./base-local-auth.guard";


@Injectable()
export class RefreshTokenGuard extends BaseLocalAuthGuard("jwt-refresh-token") {
}