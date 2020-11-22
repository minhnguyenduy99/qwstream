import { Module } from "@nestjs/common";
import { GoogleAuthModule } from "./google-auth";
import { OfficialModule } from "./official";


@Module({
    imports: [
        GoogleAuthModule,
        OfficialModule
    ]
})
export class AuthModule {
}