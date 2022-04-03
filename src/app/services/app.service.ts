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

  public domain: string;
  public hostname: string;

  public siteName = '';
  public webAvatar: string = 'assets/imgs/logo/web_avatar.jpg';

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
  
  public uploadPath: string = 'wp';

  public vflApi = {
    server: 'https://api.vfl-admin.com',
    local: 'http://localhost:3333'
  }
  public publicApi!: string;

  public tables = {
    categories: 'categories',
    posts: {
      manager: 'manager',
      list: 'list'
    },
    forms: 'forms',
    adsBanners: 'ads_banners'
  }

  public postAlias = {
    general: 'general',
    post: 'post',
    article: 'article'
  }
  
  public userData: any = {};
  public userAgent: any;

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
    this.hostname = this.isServer ? this.request.hostname :  document.location.hostname;
    if (this.hostname !== 'localhost') {
      this.domain = this.hostname;
      this.api.base = this.api.server;
      this.publicApi = this.vflApi.server;
    } else {
      this.getDomainName();
      this.api.base = this.api.local;
      this.publicApi = this.vflApi.local;
    }
    this.api.filesStorage = this.api.base + '/uploads';
  }

  getDomainName() {
    if (typeof (Storage) !== "undefined") {
      this.domain = localStorage.getItem("domain");
      if (!this.domain) {
        this.domain = 'ssr-ng9.vfl-admin.com';
        localStorage.setItem("domain", this.domain);
      };
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

  getPostsTable(catData: any, type: string) {
    return catData.table_name + type;
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

  addSqlData(postData: any) {
    const data = {
      api_key: this.api.password,
      domain: this.domain,
      table: postData.table,
      fields: postData.fields,
      options: postData.options
    }
    const url = this.api.base + this.api.apiRoute + this.api.add;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    let body = new URLSearchParams();
    body.set('data', JSON.stringify(data));
    return this.http.post<any>(url, body.toString(), { headers: headers });
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

  getLocations(lang: string) {
    let query = lang ? ('?lang=' + lang) : '';
    const url = this.publicApi + '/locations' + query;
    return this.http.get<any>(url);
  }

  getCurrencies() {
    const url = this.api.base + '/currency/get-data';
    return this.http.get<any>(url);
  }

  getAnyApi(apiUrl: string) {
    return this.http.get<any>(apiUrl);
  }

  sendMail(mailData: any) {
    const url = this.publicApi + '/nodemailer/send-mail';
    const headers = new HttpHeaders({ 'Accept': 'application/json', });
    const params = new HttpParams().set('data', JSON.stringify(mailData));
    return this.http.post<any>(url, null, { headers: headers, params: params });
  }

  logErr(err: any, funtion: string, component: string) {
    const data = {
      err: err,
      time: new Date(),
      note: 'Error on ' + funtion + ' of ' + component
    }
    console.log(data);
  }

  sortArray(array: any[], sortBy?: string) {
    if (sortBy === undefined) { sortBy = 'sortNum' };
    const compare = (a: any, b: any) => {
      if (sortBy === 'sortNum') {
        var A = a.sortNum;
        var B = b.sortNum;
      } else {
        var A = a.id;
        var B = b.id;
      }
      let comparison = 0;
      if (A > B) {
        comparison = 1;
      } else if (A < B) {
        comparison = -1;
      }
      return comparison;
    }
    return array.sort(compare);
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

  getFileSrc(data: any) {
    if (data) {
      if (data.type === 'file') {
        return this.api.filesStorage + '/' + this.uploadPath + '/' + data.value;
      } else if (data.type === 'href' || data.type === 'iframe') {
        return data.value;
      } else {
        return null;
      }
    } return null;
  }

}
