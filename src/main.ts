import "module-alias/register";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { APP_CONFIG_KEY } from "./app.config";
import { BodyValidationPipe } from "@helpers/validation";
import * as cookieParser from "cookie-parser"
import { initAdapter } from "@services/redis-socket";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new BodyValidationPipe());

  // initAdapter(app);

  app.enableCors({
    origin: [/localhost/, "http://192.168.148.57:3016"],
    credentials: true
  });

  app.use(cookieParser());
  const config = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle("QWStream API Specification")
    .setDescription("API Specification for QWStream")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get(APP_CONFIG_KEY.SWAGGER_API_PATH), app, document);

  const host = config.get(APP_CONFIG_KEY.HOST);
  const port = config.get(APP_CONFIG_KEY.PORT);

  await app.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
  });
}
bootstrap();
