import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_CONFIG_KEY } from "./app.config";



@Injectable()
export class AppService {

    constructor(
        private readonly configService: ConfigService
    ) {}

    get serverURL() {
        return `${this.host}:${this.port}`;
    }

    get publicURL() {
        return `${this.serverURL}/${this.publicFolder}`;
    }

    get host() {
        return this.configService.get(APP_CONFIG_KEY.HOST);
    }

    get port() {
        return this.configService.get(APP_CONFIG_KEY.PORT);
    }

    get rootDir() {
        return this.configService.get(APP_CONFIG_KEY.ROOT_DIR);
    }

    get publicFolder() {
        return this.configService.get(APP_CONFIG_KEY.PUBLIC_FOLDER);
    }
}