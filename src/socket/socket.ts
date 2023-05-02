import { Server, Socket } from "socket.io";
import http from "http";
import { SocketEventTypes } from "./type";

export class SocketServer {
    private io: Server;
    constructor(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
            },
        });

        this.io.on(SocketEventTypes.CONNECT, this.handleConnection);
    }

    private handleConnection = (socket: Socket) => {
        console.log(`Socket ${socket.id} connected`);
        socket.on(SocketEventTypes.DISCONNECT, () => this.handleDisconnect(socket));
    };

    private handleDisconnect = (socket: Socket) => {
        console.log(`Socket ${socket.id} disconnected`);
    };

    public automatedNewsLetterResponse(
        socketId: string,
        responsePayload: {
            success: boolean;
            twitterUrl: string;
            message: string;
        }
    ) {
        this.io.to(socketId).emit(SocketEventTypes.NEWSLETTER_RESPONSE_SENT, responsePayload);
    }

    public automatedNewsLetterFailure(
        socketId: string,
        responsePayload: {
            success: boolean;
            message: string;
        }
    ) {
        this.io.to(socketId).emit(SocketEventTypes.NEWSLETTER_RESPONSE_FAILED, responsePayload);
    }
}
