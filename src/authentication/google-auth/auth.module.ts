import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { readFileSync } from "fs";
import { join } from "path";
import { GoogleCredential, ModuleConfig, ModuleConfigLoader } from "./auth.config";
import CONSTS from "./consts";
import { GoogleAuth, GoogleAuthSchema } from "./auth.model";
import { GoogleAuthService } from "./auth.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ModuleConfigLoader]
    }),
    MongooseModule.forFeature([
      { name: GoogleAuth.name, schema: GoogleAuthSchema }
    ])
  ],
  providers: [
    GoogleAuthService,
    {
      provide: CONSTS.LOGGER,
      useValue: new Logger("GoogleAuth")
    },
    {
      provide: CONSTS.CREDENTIALS,
      useFactory: (configService: ConfigService) => {
        const rootDir = configService.get("ROOT_DIR");
        const { configFile, configFolder } = configService.get<ModuleConfig>("config");
        const content = readFileSync(join(rootDir, configFolder, configFile), { encoding: "utf-8" });
        const credential = JSON.parse(content) as GoogleCredential;
        return credential;
      },
      inject: [ConfigService]
    }
  ],
  exports: [GoogleAuthService]
})
export class GoogleAuthModule {
}