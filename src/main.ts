import "module-alias/register";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BodyValidationPipe } from "@helpers/validation";
import * as cookieParser from "cookie-parser"
import { static as serverStatic } from "express";
import { AppService } from "./app.service";
import { RequestLogInterceptor } from "./helpers/interceptors";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const appService = app.get(AppService);
  const rootDir = appService.rootDir;

  app.useGlobalPipes(new BodyValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new RequestLogInterceptor());

  app.enableCors({
    origin: [/localhost/, /192.168.1.241/],
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
