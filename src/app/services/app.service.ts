import { Injectable, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import 'rxjs/add/operator/toPromise';
import { Md5 } from 'ts-md5/dist/md5';

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
    server: 'https://ws-api.yuvn.shop',
    filesStorage: '',
    apiRoute: '/web-pages',
    get: '/get-data?data=',
    add: '/add-data',
    edit: '/edit-data',
    delete: '/delete-data'
  }
  
  public uploadPath: string = 'wp';

  public vflApi = {
    server: 'https://api.yuvn.shop',
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
    adsBanners: 'ads_banners',
    webComments: 'web_comments',
    members: 'app_members'
  }

  public postAlias = {
    general: 'general',
    post: 'post',
    article: 'article'
  }
  
  USERS: any;
  public isLogeds: any = [];
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
    // console.log('isServer: ' + this.isServer);
    // console.log('isBrowser: ' + this.isBrowser);
    
    this.hostname = this.isServer ? this.request.hostname :  document.location.hostname;
    // console.log('---hostname = ' + this.hostname);

    if (this.hostname !== 'localhost') {
      this.domain = this.hostname;
      this.api.base = this.api.server;
      this.publicApi = this.vflApi.server;
    } else {
      this.api.base = this.api.local;
      this.publicApi = this.vflApi.local;

      if (this.isServer) {
        this.domain = '4fx.vn'; //Fixed domain to check source rendered on localhost
      } else {
        this.getDomainName();
      }
      // console.log('Domain = ' + this.domain);
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

  editSqlData(postData: any) {
    const data = {
      api_key: this.api.password,
      domain: this.domain,
      table: postData.table,
      set: postData.set,
      where: postData.where,
      params: postData.params
    }
    const url = this.api.base + this.api.apiRoute + this.api.edit;
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

  getUserData() {
    if (typeof (Storage) !== "undefined") {
      const isLogeds = this.isArray(localStorage.getItem("isLogeds")).data;
      const userData = isLogeds.find((item: any) => item.isLoged === true);
      if (userData) {
        this.userData = userData;
        return userData;
      } return {};
    }
  }

  setUserData(userData: any) {
    let agency_code = userData.agency_code;
    if (!agency_code) { agency_code = 'admins' };

    const getAvatar = () => {
      const isString = typeof(userData.avatar) === 'string';
      return isString ? { type: 'file', value: userData.avatar } : this.isObject(userData.avatar).data;
    }
    const avatar = getAvatar();
    this.getUserAvatarUrl(avatar);

    const user = {
      alias: userData.userLevel + '_' + userData.username,
      username: userData.username,
      nickname: userData.nickname,
      fullname: userData.fullname,
      avatar: avatar,
      agency_code: agency_code,
      userLevel: userData.userLevel,
      provider: userData.provider,
      status: userData.status,
      login_code: userData.login_code,
      isLoged: true
    }
    this.userData = user;

    if (typeof (Storage) !== "undefined") {
      const isLogeds = this.isArray(localStorage.getItem("isLogeds")).data;
      const index = isLogeds.findIndex((item: any) => item.alias === user.alias);
      if (index === -1) {
        isLogeds.push(user);
      } else {
        isLogeds.splice(index, 1, user);
      }
      this.isLogeds = isLogeds;
      localStorage.setItem("isLogeds", JSON.stringify(isLogeds));
    }
  }

  getUserAvatarUrl(avatar: any) {
    if (avatar) {
      if (avatar.value) {
        if (avatar.type === 'href') {
          avatar.src = avatar.value;
        } else {
          //Get src here...
        }
      }
    }
  }

  userLogin(dataPost: any) {
    const data = {
      secur_key: 'b0a8944dd5410f52cce2c84bc859b10e',
      username: dataPost.username,
      password: dataPost.password,
      userLevel: dataPost.userLevel,
      onStatus: dataPost.onStatus
    }
    const url = this.publicApi + '/accounts/login';
    const params = new HttpParams().set('data', JSON.stringify(data));
    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      params: params
    };
    return this.http.post<any>(url, null, httpOptions);
  }

  clientSignUp(userData: any) {
    const data = {
      api_key: this.api.password,
      domain: this.domain,
      userData: userData
    }
    const url = this.api.base + '/accounts/client-sign-up';
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    let body = new URLSearchParams();
    body.set('data', JSON.stringify(data));
    return this.http.post<any>(url, body.toString(), { headers: headers });
  }

  getUsers() {
    const data = {
      api_key: this.api.password,
      domain: this.domain
    }
    const query = JSON.stringify(data);
    const url = this.api.base + '/accounts/get-users?data=' + query;
    return this.http.get<any>(url);
  }

  renderUser(user: any) {
    user.alias = user.userLevel + '_' + user.username;
    user.avatar = this.isObject(user.avatar).data;
    this.getUserAvatarUrl(user.avatar);
  }

  updateSocialUserData(user: any, username: string) {
    const avatar = {
      type: user.avatar.type,
      value: user.avatar.value
    }
    const dataPost = {
      table: this.tables.members,
      set: 'fullname = ?, avatar = ?',
      where: 'username',
      params: [
        user.fullname,
        JSON.stringify(avatar),
        username
      ]
    }
    const logErr = (err) => this.logErr(err, 'updateSocialUserData()', 'AppService');
    this.editSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        if (this.USERS) {
          const e = this.USERS.find((item: any) => item.username === username);
          if (e) {
            e.fullname = user.fullname;
            e.avatar = avatar;
            this.getUserAvatarUrl(e.avatar);
          }
        }
      } else {
        logErr(res.err);
      }
    }, err => logErr(err));
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
      string = string.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
      string = string.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
      string = string.replace(/??|??|???|???|??/g, "i");
      string = string.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
      string = string.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
      string = string.replace(/???|??|???|???|???/g, "y");
      string = string.replace(/??/g, "d");
      string = string.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
      string = string.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
      string = string.replace(/??|??|???|???|??/g, "I");
      string = string.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
      string = string.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
      string = string.replace(/???|??|???|???|???/g, "Y");
      string = string.replace(/??/g, "D");
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

  md5(string: string) {
    return Md5.hashStr(string);
  }

  randomString() {
    let string = (Math.random() + 1).toString(36).substring(7);
    return string;
  }

}
