import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RedisSocketModule } from "@services/redis-socket";
import { RedisModule } from "@services/redis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ChatConfigLoader, TICKET_SECRET_KEY } from "./config";
import { ChatService } from "./services/service.chat";
import { RoomTicketService } from "./services/service.ticket";
import { ChatController } from "./controller";



@Module({
    imports: [
        RedisSocketModule,
        RedisModule,
        ConfigModule.forRoot({
            load: [ChatConfigLoader]
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get(TICKET_SECRET_KEY)
                
            }),
            inject: [ConfigService]
        })
    ],
    providers: [
        ChatService, RoomTicketService
    ],
    exports: [ChatController]
})
export class ChatModule {
}