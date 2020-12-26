import { Module } from "@nestjs/common";
import { UserModule } from "./core";
import { ProfileController, UserController } from "./controllers";
import { ConfigModule } from "@nestjs/config";
import { ModuleConfigLoader } from "./user-management.config"
import { AuthorizationModule } from "src/authorization";
import authorizationConfig from "./authorization.config"
import { UserEventHandler } from "./eventHandler";

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            load: [ModuleConfigLoader]
        }),
        AuthorizationModule.forFeature({ config: authorizationConfig }),
    ],
    controllers: [UserController, ProfileController],
    exports: [UserModule],
    providers: [UserEventHandler]
})
export default class UserManagementModule { }