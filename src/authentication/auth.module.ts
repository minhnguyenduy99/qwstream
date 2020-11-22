import { Module } from "@nestjs/common";
import { GoogleAuthModule } from "./google-auth";


@Module({
    imports: [
        GoogleAuthModule
    ]
})
export class AuthModule {
}