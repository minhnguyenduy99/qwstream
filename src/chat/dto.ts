import { IsNotEmpty, IsOptional } from "class-validator";



export class OpenChatRoomInput {
    host_id: string;
}

export interface OpenChatRoomOutput {
    code: number;
    data: {
        room_id: string;
        host_id: string;
        opened_time: number;
    }
}

export class ProduceTicketInput {
    
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    room_id: string;

    @IsOptional()
    client_ip: string;
}

export interface RoomTicket {
    user_id: string;
    user_name: string;
    room_id: string;
    client_ip: string;
    is_host: boolean;
    created_time: number;
}


export interface RoomDTO {
    room_id: string;
    host_id: string;
    opened_time: string;
}


// Socket event messages
export interface UserJoinedInput {
    user_id: string;
    room_id: string;
}

export interface MessageSentInput {
    user_id: string;
    room_id: string;
    message: string;
}


export interface MessageSentOutput {
    user_name: string;
    time_stamp: string;
    message: string;
}


export class LeaveRoomInput {
    user_id: string;
    room_id: string;
}