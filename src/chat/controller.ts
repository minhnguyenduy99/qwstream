import { Body, Controller, Post } from "@nestjs/common";
import { OpenChatRoomInput } from "./dto";
import { ChatModuleException } from "./errors";
import { ChatService } from "./services/service.chat";


@Controller("chat")
export class ChatController {


    constructor(
        private readonly chatService: ChatService
    ) {}

    @Post()
    async createChatRoom(@Body() body: OpenChatRoomInput) {
        const result = await this.chatService.createChatRoom(body);
        if (!result) {
            throw new ChatModuleException();
        }
        return result;
    }
}