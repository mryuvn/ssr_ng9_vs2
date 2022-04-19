import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  public messages = {
    user: {
      login: 'userLogin',
      logout: 'userLogout',
      clientSignUp: 'clientSignUp'
    },
    webContact: 'clientSendContact',
    webComment: {
      write: 'clientWriteComment',
      reply: 'clientReplyComment'
    }
  }

  socket: SocketIOClient.Socket;
  baseUrl: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appService: AppService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.baseUrl = this.appService.publicApi;
      this.socket = io(this.baseUrl);
    }
  }

  public onConect() {
    // console.log(this.socket);
  }

  public emit(message, data) {
    if (this.socket) {
      this.socket.emit(message, data);
    }
  }

  public on = (message): Observable<any> => {
    if (isPlatformBrowser(this.platformId)) {
      return Observable.create(observer => {
        this.socket.on(message, data => {
          observer.next(data);
        });
      });
    }
  }

}
