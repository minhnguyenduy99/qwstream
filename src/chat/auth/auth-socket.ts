import { Socket } from "socket.io";



export interface AuthenticatedSocket extends Socket {
    auth: AuthenticatedData;
    ticket: string;
}


export interface AuthenticatedData {
    user_id: string;
    user_name: string;
    room_id: string;
    is_host: boolean;
}