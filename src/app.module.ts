import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfig } from "./app.config";
import { UserManagementModule } from "./user-management";
import { ChannelModule } from "./channel";
import { AuthModule } from "./authentication";
import { AuthorizationModule } from "./authorization";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { IdGeneratorModule } from "./services/id-generator";
import { AppService } from "./app.service";

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
    IdGeneratorModule,
    UserManagementModule,
    ChannelModule,
    AuthModule.useGlobal(),
    AuthorizationModule.forRoot({
      roles: ["channel-owner", "user", "guest"]
    })
  ],
  providers: [
    AppService
  ],
  exports: [AppService]
})
@Global()
export class AppModule {}
