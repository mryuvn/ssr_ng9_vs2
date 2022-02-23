import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public domain = 'ng9-ssr.vfl-admin.com';
  public siteName = 'NG9 SSR WEB DEMO';
  public webAvatar: string = 'assets/imgs/web_avatar.jpg';

  public api = {
    password: '32727a5ebaac9326f075f6804c0733e3',
    base: '',
    local: 'http://localhost:8998',
    server: 'http://45.119.81.184:8998',
    filesStorage: '',
    apiRoute: '/web-pages',
    get: '/get-data?data=',
    add: '/add-data',
    edit: '/edit-data',
    delete: '/delete-data'
  }

  public vflApi = {
    server: 'https://api.vfl-admin.com',
    local: 'http://localhost:3333'
  }
  public publicApi!: string;

  public tables = {
    categories: 'categories'
  }

  public languages: any;
  public locations: any;
  public currencyData: any;

  isServer!: boolean;
  isBrowser!: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any,
    @Optional() @Inject(REQUEST) protected request: Request,
  ) {
    this.isServer = isPlatformServer(this.platformId);
    this.isBrowser = isPlatformBrowser(this.platformId);
    const domain = this.isServer ? this.request.hostname :  document.location.hostname;
    if (domain !== 'localhost') {
      this.domain = domain;
      this.api.base = this.api.server;
      this.publicApi = this.vflApi.server;
    } else {
      this.api.base = this.api.local;
      this.publicApi = this.vflApi.local;
    }
  }

  getDomainData() {
    const data = {
      api_key: this.api.password,
      domain: this.domain
    }
    const query = JSON.stringify(data);
    const url = this.api.base + this.api.apiRoute + '/get-domain-data?data=' + query;
    return this.http.get<any>(url);
  }

  getLanguages() {
    const url = this.publicApi + '/locations/get-languages';
    return this.http.get<any>(url).toPromise().then(res => {
      if (res.data) {
        this.languages = res.data;
        return res.data;
      }
      return res;
    }).catch(err => err);
  }

  getSqlData(queryData: any) {
    const data = {
      api_key: this.api.password,
      domain: this.domain,
      table: queryData.table,
      fields: queryData.fields,
      where: queryData.where,
      orderBy: queryData.orderBy,
      limit: queryData.limit
    }
    const query = JSON.stringify(data);
    const url = this.api.base + this.api.apiRoute + this.api.get + query;
    return this.http.get<any>(url);
  }





}
