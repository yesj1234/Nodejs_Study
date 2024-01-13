import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export class ChatGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  handleDisconnect(client: any) {
    console.log('Client disconnected');
    console.log(client.id);
  }
  handleConnection(client: any) {
    console.log('Client connected');
    console.log(client.id);
  }
  afterInit() {
    console.log('Server initialized');
  }
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    const { message, nickname } = data;
    socket.broadcast.emit('message', { message: `${nickname}: ${message}` });
  }
}

@WebSocketGateway({ namespace: 'room' })
export class RoomGateWay {
  constructor(private readonly chatGateway: ChatGateWay) {}
  rooms = [];
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createRoom')
  handleMessage(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log(socket);
    const { nickname, room } = data;
    this.chatGateway.server.emit('notice', {
      message: `${nickname} has created the room ${room}`,
    });
    this.rooms.push(room);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    const { nickname, room, toLeaveRoom } = data;
    socket.leave(toLeaveRoom);
    this.chatGateway.server.emit('notice', {
      message: `${nickname} has entered the room ${room}`,
    });
    socket.join(room);
  }

  @SubscribeMessage('message')
  handleMessageToRoom(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    const { nickname, room, message } = data;
    socket.broadcast.to(room).emit('message', {
      message: `${nickname}: ${message}`,
    });
  }
}
