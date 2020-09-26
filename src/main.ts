import "module-alias/register";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { APP_CONFIG_KEY } from "./app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(port, host);
}
bootstrap();
