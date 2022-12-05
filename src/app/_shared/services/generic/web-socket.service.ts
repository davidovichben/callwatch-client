import { Injectable } from "@angular/core";
import { Subject, Observable, Observer } from 'rxjs';

@Injectable()
export class WebSocketService {

  private url = 'ws://localhost:6001/';

  private subject: Subject<MessageEvent>;

  public connect(): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(this.url);
    }

    return this.subject;
  }

  private create(url): Subject<MessageEvent> {
    let ws = new WebSocket(url);

    ws.send(JSON.stringify({"command": "subscribe","identifier":"{\"channel\":\"user\"}"}))


    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
}
