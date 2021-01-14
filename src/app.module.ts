import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfig, APP_CONFIG_KEY } from "./app.config";
import { UserManagementModule } from "./user-management";
import { ChannelModule } from "./channel";
import { AuthModule } from "./authentication";
import { AuthorizationModule } from "./authorization";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { IdGeneratorModule } from "./services/id-generator";
import { AppService } from "./app.service";
import { role } from "./role.config";
import { StreamingModule } from "./streaming";
import { RedisCoreModule } from "./services/redis-core";

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
    StreamingModule,
    AuthModule.useGlobal(),
    AuthorizationModule.forRoot({
      roles: Object.values(role)
    }),
    RedisCoreModule.forRoot({
      redis: {
        imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
              return {
                  host: configService.get(APP_CONFIG_KEY.REDIS_HOST),
                  port: configService.get(APP_CONFIG_KEY.REDIS_PORT)
              }
          },
          inject: [ConfigService]
      }
    })
  ],
  providers: [
    AppService
  ],
  exports: [AppService]
})
@Global()
export class AppModule {}
