import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket: Socket;

  constructor() {
    const ip = 'localhost:3000'
    this.socket = io(ip)

    this.socket.on('connection', () => {
      console.log('connected')
    });

    this.socket.on('message', (message) => {
      console.log(message);
    })
  }

  sendMessage(msg: string) {
    this.socket.emit('messageToServer', msg);
  }


  socketIo(): void {
    this.socket.emit('messageToServer', 'message from client finally')
  }
}
