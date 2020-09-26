import { Module } from "@nestjs/common";
import { CoreModule } from "./core";
import { UserController } from "./controllers";
import { ConfigModule } from "@nestjs/config";
import { ModuleConfig } from "./user-management.config"

@Module({
    imports: [
        CoreModule,
        ConfigModule.forRoot({
            load: [ModuleConfig]
        })
    ],
    controllers: [UserController]
})
export default class UserManagementModule {}