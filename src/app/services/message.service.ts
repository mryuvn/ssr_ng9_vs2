import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messages = {
    layoutLoaded: 'layoutLoaded',
    routerLoading: 'routerLoading',
    emitDataSearchResult: 'emitDataSearchResult'
  }

  private subject = new Subject<any>();

  constructor() { }

  sendMessage(message: string, data: any) {
    this.subject.next({ text: message, data: data });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  
}
