import { Module } from "@nestjs/common";
import { UserModule, ProfileCommitService, ProfileQueryService, UserCommitService, UserQueryService } from "./core";
import { ProfileController, UserController } from "./controllers";
import { ConfigModule } from "@nestjs/config";
import { ModuleConfigLoader } from "./user-management.config"

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            load: [ModuleConfigLoader]
        })
    ],
    controllers: [UserController, ProfileController],
    exports: [UserModule]
})
export default class UserManagementModule { }