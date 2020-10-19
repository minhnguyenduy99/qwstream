import { Module } from "@nestjs/common";
import { CoreModule } from "./core";
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
    controllers: [UserController, ProfileController]
})
export default class UserManagementModule {}