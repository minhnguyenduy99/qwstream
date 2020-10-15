import { Module } from "@nestjs/common";
import { AuthController, StreamingRoomController } from "./controllers";



@Module({
    providers: [
        { 
            provide: "rooms",
            useValue: {
                games: [],
                general: [],
                sports: []
            }
        }
    ],
    controllers: [AuthController, StreamingRoomController]
})
export class StreamingModule {}