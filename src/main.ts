import "module-alias/register";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BodyValidationPipe } from "@helpers/validation";
import * as cookieParser from "cookie-parser"
import { static as serverStatic } from "express";
import { initAdapter } from "@services/redis-socket";
import { AppService } from "./app.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  const rootDir = appService.rootDir;

  app.useGlobalPipes(new BodyValidationPipe());

  // initAdapter(app);

  app.enableCors({
    origin: [/localhost/, "http://192.168.148.57:3016"],
    credentials: true
  });

  app.use(cookieParser());
  app.use("/public", serverStatic(join(rootDir, "public")));

  const host = appService.host;
  const port = appService.port;

  await app.listen(port, host, () => {
    console.log(`Listening on ${appService.serverURL}`);
  });
}
bootstrap();
