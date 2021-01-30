import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class PreloadingService implements PreloadingStrategy {

  preloadedModules: string[] = [];

  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      this.preloadedModules.push(route.path);
      return fn();
    } else {
      return Observable.of(null);
    }
  }
  
}
