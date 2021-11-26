import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public messages = {
    emitClientUser: 'emitClientUser',
    loginChecked: 'loginChecked',
    sendUserData: 'sendUserData',
    removeUserData: 'removeUserData',
    changeLanguage: 'changeLanguage',
    emitSiteValues: 'emitSiteValues',
    emitMenuData: 'emitMenuData',
    setActivePath: 'setActivePath',
    routerLoaded: 'routerLoaded',
    getPageConfig: 'getPageConfig',
    emitThemeSettings: 'emitThemeSettings',
    openThemeSettings: 'openThemeSettings',
    updateThemeSettings: 'updateThemeSettings',
    changeToolbarMenuViewMode: 'changeToolbarMenuViewMode',
    openImageViewer: 'openImageViewer',
    openForm: {
      consulRegister: 'openConsulRegister',
      review: 'openReviewForm'
    },
    marks: {
      addToCart: 'addToCart',
      updateCart: 'updateCart',
      updateOrder: 'updateOrder',
      favorite: 'markFavorite'
    },
    pageFullscreen: 'pageFullscreen'
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
