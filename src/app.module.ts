import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfig } from "./app.config";
import { UserManagementModule } from "./user-management";
import { ChannelModule } from "./channel";
import { AuthModule } from "./authentication";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".development.env",
      load: [AppConfig]
    }),
    MongooseModule.forRoot(
      process.env.MONGO_DATABASE_URI
    ),
    EventEmitterModule.forRoot({
      delimiter: "."
    }),
    UserManagementModule,
    ChannelModule,
    AuthModule
  ]
})
export class AppModule {}
