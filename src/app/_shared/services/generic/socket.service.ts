import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  echo: Echo = null;

  setupWithToken(token) {
    if (!token) {
      this.echo = null;

      return;
    }

    this.echo = new Echo({
      broadcaster: 'socket.io',
      host: 'http://localhost:8001',
      auth: {
        headers: { 'Authorization': 'Bearer ' + token }
      }
    });

    window['echo'] = this.echo;

    this.listen();
  }

  listen(): void {
    this.echo.private('test-channel')
      .listen('.test', e => {
        console.log(e);
        alert('received test event via socket private secured channel')
      })
  }
}
