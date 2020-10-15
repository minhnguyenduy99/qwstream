import { Injectable } from "@nestjs/common";
import { RedisDBService } from "@services/redis";
import { OpenChatRoomInput, OpenChatRoomOutput, ProduceTicketInput } from "../dto";
import { ChatModuleException, InvalidRoomIdException } from "../errors";
import { RoomTicketService } from "./service.ticket";

@Injectable()
export class ChatService {


    constructor(
        private readonly redisDBService: RedisDBService,
        private readonly ticketService: RoomTicketService
    ) {}

    async createChatRoom(input: OpenChatRoomInput): Promise<OpenChatRoomOutput> {
        const now = Date.now();
        const roomId = `${input.host_id}:${now}`;
        const result = await this.redisDBService.setUniqueKey(roomId, roomId);
        if (result.code === 0) {
            return {
                code: 0,
                data: {
                    host_id: input.host_id,
                    room_id: roomId,
                    opened_time: now
                }
            }
        }
        return null;
    }

    async produceTicket(input: ProduceTicketInput, isHost = false) {
        const room = await this.getRoomById(input.room_id);
        if (!room) {
            throw new InvalidRoomIdException();
        }
        try {
            const ticket = await this.ticketService.produceTicket(input, isHost);
            this.redisDBService.setUniqueKey(ticket, ticket);
            return ticket
        } catch (err) {
            throw new ChatModuleException();
        }
    }

    async getRoomById(roomId: string) {
        const room = await this.redisDBService.getUniqueKey(roomId);
        if (!room) {
            return null;
        }
        const parts = room.split(":");
        return {
            room_id: room,
            host_id: parts[0],
            opened_time: parts[1]
        }
    }

    leaveRoom(ticket: string) {
        return this.redisDBService.delete(ticket);
    }
}