import { Module } from "@nestjs/common";
import { CoreModule, ProfileCommitService, ProfileQueryService, UserCommitService, UserQueryService } from "./core";
import { ProfileController, UserController } from "./controllers";
import { ConfigModule } from "@nestjs/config";
import { ModuleConfigLoader } from "./user-management.config"

@Module({
    imports: [
        CoreModule,
        ConfigModule.forRoot({
            load: [ModuleConfigLoader]
        })
    ],
    controllers: [UserController, ProfileController],
    exports: [CoreModule]
})
export default class UserManagementModule { }