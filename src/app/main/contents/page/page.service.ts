import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  public MODULES: any;
  public POSTS: any = [];

  constructor() { }
}
