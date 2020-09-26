import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import AppConfiguration from "./app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".development.env",
      load: [AppConfiguration]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
