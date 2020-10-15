import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProduceTicketInput, RoomTicket } from "../dto";
import { InvalidTicketException } from "../errors";

@Injectable()
export class RoomTicketService {


    constructor(
        private readonly jwtService: JwtService
    ) {}


    async produceTicket(input: ProduceTicketInput, isHost = false) {
        const payload = {
            ...input,
            is_host: isHost,
            // add user_name to payload
            created_time: Date.now()
        };
        const ticket = await this.jwtService.sign(payload);
        return ticket;
    }

    async verifyTicket(ticket) {
        try {
            const payload = await this.jwtService.verify(ticket) as RoomTicket;
            // check if user exists
            return payload;
        } catch (err) {
            throw new InvalidTicketException();
        }
    }
}   