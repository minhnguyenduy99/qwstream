import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfig } from "./app.config";
import { UserManagementModule } from "./user-management";
import { ChannelModule } from "./channel";
import { AuthModule } from "./authentication";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".development.env",
      load: [AppConfig]
    }),
    MongooseModule.forRoot(
      process.env.MONGO_DATABASE_URI
    ),
    UserManagementModule,
    ChannelModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
