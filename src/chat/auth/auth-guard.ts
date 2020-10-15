import { CanActivate, ExecutionContext } from "@nestjs/common";
import { RoomTicketService } from "../services/service.ticket";
import { AuthenticatedSocket } from "./auth-socket";



export class SocketAuthGuard implements CanActivate {


    constructor(
        private readonly ticketService: RoomTicketService
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socket = context.switchToWs().getClient() as AuthenticatedSocket;
        const payload = await this.ticketService.verifyTicket(socket.ticket);
        if (!socket.ticket) {
            return false;
        }
        socket.auth = {
            user_id: payload.user_id,
            user_name: payload.user_name,
            room_id: payload.room_id,
            is_host: payload.is_host
        }
        return true;
    }
}