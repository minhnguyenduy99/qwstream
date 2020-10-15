import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";



@Injectable()
export class SocketStateService {
    private socketState = new Map<string, Socket[]>();
    
    add(userId: string, socket: Socket) {
        const existSockets = this.socketState.get(userId) || [];
        const sockets = [...existSockets, socket];
        this.socketState.set(userId, sockets);
        return true;
    }

    remove(userId: string, socket: Socket) {
        const existingSocekts = this.socketState.get(userId) || [];
        const indexOfRemovedSocket = existingSocekts.findIndex((s) => s.id === socket.id);
        if (indexOfRemovedSocket === -1) {
            return false;
        }
        existingSocekts.splice(indexOfRemovedSocket, 1);
        if (existingSocekts.length === 0) {
            this.socketState.delete(userId);
        } else {
            this.socketState.set(userId, existingSocekts);
        }
        return true;
    }

    get(userId: string) {
        return this.socketState.get(userId);
    }

    getAll(): Socket[] {
        const sockets = [];
        this.socketState.forEach((value) => sockets.push(...value));
        return sockets;
    }
}