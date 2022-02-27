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

  public domain = 'ssr-ng9.vfl-admin.com';
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
    categories: 'posts_cats'
  }

  public domainData: any;

  sitelang: string;
  public languages: any;
  public locations: any;
  public currencyData: any;

  public socialBtns = [
    {
      alias: 'facebook',
      faIcon: 'fab fa-facebook-f',
      href: '',
      target: '_blank'
    }, {
      alias: 'youtube',
      faIcon: 'fab fa-youtube',
      href: '',
      target: '_blank'
    }, {
      alias: 'twitter',
      faIcon: 'fab fa-twitter',
      href: '',
      target: null
    }, {
      alias: 'telegram',
      faIcon: 'fab fa-telegram-plane',
      href: '',
      target: null
    }, {
      alias: 'zalo',
      imgIcon: 'zalo2.png',
      href: 'https://zalo.me/',
      target: null
    }
  ]

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

  getPageData(catData: any) {
    const data = {
      api_key: this.api.password,
      domain: this.domain,
      catData: catData
    }
    const query = JSON.stringify(data);
    const url = this.api.base + this.api.apiRoute + '/get-page-data?data=' + query;
    return this.http.get<any>(url);
  }

  getLanguages() {
    const url = this.publicApi + '/locations/get-languages';
    return this.http.get<any>(url).toPromise().then(res => {
      if (res.data) {
        this.languages = res.data;
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

  getErr(err: any, funtion: string, component: string) {
    const data = {
      err: err,
      time: new Date(),
      note: 'Error on ' + funtion + ' of ' + component
    }
    return data;
  }


  isJSON(value: any) {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
      } catch (error) {
        return null;
      }
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  isArray(value: any) {
    const JSON = this.isJSON(value);
    if (Array.isArray(JSON)) {
      return {
        data: JSON
      }
    } 
    return {
      data: [],
      err: 'Value is not an Array',
      value: value
    };
  }

  isObject(value: any) {
    const JSON = this.isJSON(value);
    if (JSON) {
      if (Array.isArray(JSON)) {
        return {
          err: 'Value is not an Object, it is a Array',
          value: JSON,
          data: {}
        }
      }
      return {
        data: JSON
      };
    } 
    return {
      err: 'Value is not a JSON',
      value: value,
      data: {}
    }
  }

  removeAccents(string: string) {
    if (string) {
      string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      string = string.replace(/đ/g, "d");
      string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      string = string.replace(/Đ/g, "D");
      return string;
    }
    return '';
  }

  getLink(string: string) {
    if (string) {
      string = this.removeAccents(string);
      string = string.replace(/ /g, "-");
      string = string.replace(/,/g, "");
      string = string.replace(/;/g, "");
      string = string.replace(/~/g, "");
      string = string.replace(/[.]+/g, "");
      string = string.replace(/[(]+/g, "");
      string = string.replace(/[?]+/g, "");
      string = string.replace(/[)]+/g, "");
      string = string.replace(/---/g, "-");
      string = string.replace(/--/g, "-");
      string = string.toLowerCase();
      return string;
    }
    return '';
  }


}
