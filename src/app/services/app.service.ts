import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import formurlencoded from 'form-urlencoded';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public domain = 'webdemo.vfl-admin.com';
  public appName = 'VFL Web demo';
  public appSlogan = 'Slogan here';
  public url: string;
  public webAvatar: string = 'assets/imgs/web_avatar.jpg';

  public nodeApi = {
    api_key: 'b0a8944dd5410f52cce2c84bc859b10e',
    baseUrl: {
      local: 'http://localhost:3333/',
      localSSL: 'https://localhost:3443/',
      server: 'https://api.vfl-admin.com/'
    },
    apiUrls: {
      mySql: 'mysql',
      accounts: 'accounts',
      webServices: {
        base: 'web-services',
        get: 'web-services/get-data?data=',
        add: 'web-services/add-data',
        edit: 'web-services/edit-data',
        delete: 'web-services/delete-data'
      }
    }
  }
  public baseUrl: string;

  public tables = {
    siteValues: 'site_values',
    menu: 'menu',
    gallery: 'gallery',
    fileAlbums: 'file_albums',
    library: {
      cats: 'library_cats',
      items: 'library_items'
    },
    offices: {
      cats: 'offices_cats',
      manager: 'offices_manager',
      list: 'offices_list',
      contents: 'offices_contents'
    },
    posts: {
      cats: 'posts_cats',
      manager: 'posts_manager',
      list: 'posts_list',
      contents: 'posts_contents'
    },
    blog: {
      manager: 'blog_manager',
      list: 'blog_list',
      contents: 'blog_contents'
    },
    services: {
      manager: 'services_manager',
      list: 'services_list',
      contents: 'services_contents'
    },
    recentStories: {
      manager: 'recentStories_manager',
      list: 'recentStories_list',
      contents: 'recentStories_contents'
    },
    products: {
      cats: 'products_cats',
      list: 'products_list',
      posts: 'products_posts',
      contents: 'products_contents'
    },
    promotions: 'promotions',
    simplePages: {
      list: 'simple_pages',
      contents: 'simple_page_contents'
    },
    webSupports: 'supports',
    contacts: 'contacts',
    reviews: 'reviews',
    faqs: 'faqs',
    visitors: 'visitors_data',
    embedCodes: 'site_embed_codes',
    newsSubscribe: 'news_subscribe',
    orders: 'orders'
  }

  public filesStorages = {
    local: this.nodeApi.baseUrl.local + 'uploads',
    server: this.nodeApi.baseUrl.server + 'uploads'
  };
  public filesStorage: string;
  public memberAvatar = {
    admins: this.filesStorages.server + '/admins',
    users: this.filesStorages.server + '/users'
  }
  public uploadPaths = {
    offices: 'offices',
    pages: 'pages',
    posts: 'posts',
    services: 'services',
    products: 'products',
    recentStories: 'recentStories',
    reviews: 'reviews',
    libraries: 'libraries'
  }

  public agency_code: string;
  public domainID: number;
  public databaseName: string;
  public domainDataConfig: any;
  public langsData: any = {};
  public siteValues: any = [];

  public hostname: string;
  public origin: string;
  public clientUser: string;
  public userAgent: any;
  public geoIp: any;
  public userData: any = {};

  public themeSettings = {
    light: {},
    primary: {},
    accent: {},
    warn: {},
    background: {},
    slider: {
      animation: 'fade',
    },
    toolbar: {
      fixed: true,
      height: null,
      bg: null,
      opacity: 0.96
    },
    sideNav: {
      width: 280,
      bg: 'primary'
    }
  };

  public moduleRoutes = [
    {
      lang: 'vi',
      routes: {
        home: '',
        about: 'gioi-thieu',
        contact: 'lien-he',
        news: 'tin-tuc',
        reviews: 'binh-luan',
        faqs: 'giai-dap',
        blog: 'blog',
        services: 'dich-vu',
        products: 'danh-muc-san-pham',
        product: 'san-pham',
        saleOff: 'san-pham-giam-gia',
        order: 'dat-hang',
        orderConfirm: 'xac-nhan-don-hang',
        payment: 'thanh-toan',
        userAccount: 'tai-khoan-nguoi-dung',
        signUp: 'dang-ky-tai-khoan'
      }
    },
    {
      lang: 'en',
      routes: {
        home: '',
        about: 'about-us',
        contact: 'contact-us',
        news: 'news',
        reviews: 'reviews',
        faqs: 'faqsp',
        blog: 'blog',
        services: 'services',
        products: 'products',
        product: 'product',
        saleOff: 'sale-off',
        order: 'order',
        orderConfirm: 'order-confirmation',
        payment: 'payment',
        userAccount: 'user-account',
        signUp: 'sign-up'
      }
    }
  ];

  public reviewStars = [1, 2, 3, 4, 5];

  public userStatus = [
    {
      'value': 'online',
      'title': [
        {
          'lang': 'vi',
          'content': 'Đang trực tuyến'
        },
        {
          'lang': 'en',
          'content': 'Online'
        }
      ],
      'icon': 'lens',
      'faceIcon': 'fas fa-smile-beam',
      'color': '#dacb1b'
    },
    {
      'value': 'away',
      'title': [
        {
          'lang': 'vi',
          'content': 'Vắng mặt'
        },
        {
          'lang': 'en',
          'content': 'Away'
        }
      ],
      'icon': 'access_time',
      'faceIcon': 'fas fa-meh',
      'color': '#FFC107'
    },
    {
      'value': 'doNotDisturb',
      'title': [
        {
          'lang': 'vi',
          'content': 'Đừng làm phiền!'
        },
        {
          'lang': 'en',
          'content': 'Do not Disturb!'
        }
      ],
      'icon': 'error_outline',
      'faceIcon': 'fas fa-angry',
      'color': '#F44336'
    },
    {
      'value': 'invisible',
      'title': [
        {
          'lang': 'vi',
          'content': 'Ẩn'
        },
        {
          'lang': 'en',
          'content': 'Invisible'
        }
      ],
      'icon': 'remove_circle_outline',
      'faceIcon': 'fas fa-frown-open',
      'color': '#BDBDBD'
    },
    {
      'value': 'offline',
      'title': [
        {
          'lang': 'vi',
          'content': 'Ngoại tuyến'
        },
        {
          'lang': 'en',
          'content': 'Offline'
        }
      ],
      'icon': 'lens',
      'faceIcon': 'fas fa-meh-blank',
      'color': '#aaa'
    }
  ];

  public userOptions = [
    {
      type: 'client',
      accManager: '',
      forgotPass: ''
    },
    {
      type: 'admin',
      accManager: 'https://accounts.vfl-admin.com',
      forgotPass: 'https://accounts.vfl-admin.com/user/forgot-password'
    }
  ];

  public currenciesData = [
    {
      code: 'VND',
      symbol: 'đ'
    },
    {
      code: 'USD',
      symbol: '$'
    },
    {
      code: 'CAD',
      symbol: '$ca'
    },
    {
      code: 'AUD',
      symbol: '$au'
    },
    {
      code: 'EUR',
      symbol: '€'
    },
    {
      code: 'JPY',
      symbol: '¥'
    }
  ];

  myCart: any = [];

  server: boolean = true;

  constructor(
    private http: HttpClient
  ) {
    if (this.server) {
      this.baseUrl = this.nodeApi.baseUrl.server;
      this.filesStorage = this.filesStorages.server;
    } else {
      this.baseUrl = this.nodeApi.baseUrl.local;
      this.filesStorage = this.filesStorages.local;
    }
  }

  /**
   * getSitelang
   */
  public getSitelang(lang: string) {
    var language = lang;
    if (language === 'vi') {
      language = 'vn';
    }
    return language;
  }

  /**
   * getDataLang
   */
  public getDataLang(siteLang: string) {
    var lang = siteLang;
    if (lang === 'vn') {
      lang = 'vi';
    }
    return lang;
  }

  /**
* getLanguages
*/
  public getLanguages(lang: string): Promise<any> {
    const url = this.nodeApi.baseUrl.server + 'locations/get-languages';
    return this.http.get<any>(url).toPromise().then(res => {
      if (res.data) {
        const rs = res.data.find(item => item.lang === lang);
        if (rs) {
          this.langsData = rs;
        }
      }
      return res;
    }).catch(err => err);
  }

  /**
   * getSiteValues
   */
  public getSiteValues(): Promise<any> {
    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      table: this.tables.siteValues
    }
    const queryData = JSON.stringify(data);
    const url = this.baseUrl + this.nodeApi.apiUrls.webServices.get + queryData;
    return this.http.get<any>(url).toPromise().then(res => {
      this.agency_code = res.agency_code;
      this.domainID = res.domainID;
      this.databaseName = res.databaseName;
      this.domainDataConfig = res.dataConfig;
      this.hostname = res.hostname;
      this.origin = res.origin;
      this.userAgent = res.userAgent;
      this.geoIp = res.geoIp;
      if (res.data) {
        if (res.data.length > 0) {
          const data = [];
          res.data.forEach(e => {
            e.telArr = this.isJSON(e.tels);
            if (!e.telArr) { e.telArr = []; };
            e.hotlineArr = this.isJSON(e.hotlines);
            if (!e.hotlineArr) { e.hotlineArr = []; };
            e.callcenterArr = this.isJSON(e.callcenters);
            if (!e.callcenterArr) { e.callcenterArr = []; };
            e.emailArr = this.isJSON(e.emails);
            if (!e.emailArr) { e.emailArr = []; };
            e.otherContactArr = this.isJSON(e.otherContacts);
            if (!e.otherContactArr) { e.otherContactArr = []; };

            data.push(e);
          });

          const theme = res.themeSettings;
          if (theme) {
            if (theme.light) {
              this.themeSettings.light = theme.light;
            }
            if (theme.primary) {
              this.themeSettings.primary = theme.primary;
            }
            if (theme.accent) {
              this.themeSettings.accent = theme.accent;
            }
            if (theme.warn) {
              this.themeSettings.warn = theme.warn;
            }
            if (theme.background) {
              this.themeSettings.background = theme.background;
            }
            if (theme.slider) {
              this.themeSettings.slider = theme.slider;
            }
            if (theme.toolbar) {
              this.themeSettings.toolbar = theme.toolbar;
            }
          }

          this.siteValues = data;
          return { data: data };
        } else {
          return { "mess": "dataNotFound", "err": "Data not found!" };
        }
      } else {
        return res;
      }
    }).catch(err => err);
  }

  /**
   * setWorkingTime
   */
  public setWorkingTime(siteValues) {
    const time = new Date();
    const h = time.getHours();
    const m = time.getMinutes();

    if (h > 8 && h < 18) {
      return true;
    } return false;
  }

  /**
   * getMenu
   */
  public getMenu(where: string) {
    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      where: where,
    }
    const queryData = JSON.stringify(data);
    const url = this.baseUrl + this.nodeApi.apiUrls.webServices.base + '/get-menus?data=' + queryData;
    return this.http.get<any>(url);
  }

  /**
   * getSqlData
   */
  public getSqlData(urlData) {
    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      table: urlData.table,
      fields: urlData.fields,
      where: urlData.where,
      orderBy: urlData.orderBy,
      limit: urlData.limit
    }
    const queryData = JSON.stringify(data);
    var baseUrl = urlData.baseUrl;
    if (!baseUrl) {
      baseUrl = this.baseUrl;
    }
    const url = baseUrl + this.nodeApi.apiUrls.webServices.get + queryData;
    return this.http.get<any>(url);
  }

  /**
   * addSqlData
   */
  public addSqlData(dataPost) {
    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      table: dataPost.table,
      fields: dataPost.fields,
      options: dataPost.options
    }
    var baseUrl = dataPost.baseUrl;
    if (!baseUrl) {
      baseUrl = this.baseUrl;
    }
    const url = baseUrl + this.nodeApi.apiUrls.webServices.add;
    if (dataPost.type === 'body-urlencoded') {
      const body = formurlencoded({data: JSON.stringify(data)});
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
      return this.http.post<any>(url, body, { headers: headers });
    } else {
      const params = new HttpParams().set('data', JSON.stringify(data));
      const headers = new HttpHeaders({ 'Accept': 'application/json' });
      return this.http.post<any>(url, null, { headers: headers, params: params });
    }
  }

  /**
   * editSqlData
   */
  public editSqlData(dataPost) {
    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      table: dataPost.table,
      set: dataPost.set,
      where: dataPost.where,
      params: dataPost.params
    }
    var baseUrl = dataPost.baseUrl;
    if (!baseUrl) {
      baseUrl = this.baseUrl;
    }
    const url = baseUrl + this.nodeApi.apiUrls.webServices.edit;
    if (dataPost.type === 'body-urlencoded') {
      const body = formurlencoded({data: JSON.stringify(data)});
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
      return this.http.post<any>(url, body, { headers: headers });
    } else {
      const params = new HttpParams().set('data', JSON.stringify(data));
      const headers = new HttpHeaders({ 'Accept': 'application/json' });
      return this.http.post<any>(url, null, { headers: headers, params: params });
    }
  }

  /**
   * sendMail
   */
  public sendMail(mailData) {
    const url = this.baseUrl + 'nodemailer/send-mail';
    const headers = new HttpHeaders({ 'Accept': 'application/json', });
    const params = new HttpParams().set('data', JSON.stringify(mailData));
    return this.http.post<any>(url, null, { headers: headers, params: params });
  }

  /**
   * getLocations
   */
  public getLocations(lang: string) {
    var query = '';
    if (lang) {
      query = '?lang=' + lang;
    }
    const url = this.nodeApi.baseUrl.server + 'locations' + query;
    return this.http.get<any>(url);
  }

  /**
   * getLocationData
   */
  public getLocationData(value: string, lang: string) {
    if (!value) { value = '' };
    if (!lang) { lang = '' };
    var query = '?value=' + value + '&lang=' + lang;
    const url = this.nodeApi.baseUrl.server + 'locations' + query;
    return this.http.get<any>(url);
  }

  /**
   * getCountryData
   */
  public getCountryData(code: string, lang: string) {
    if (!code) { code = '' };
    if (!lang) { lang = '' };
    const url = this.nodeApi.baseUrl.server + 'locations/get-country-data?code=' + code + '&lang=' + lang;
    return this.http.get<any>(url);
  }

  /**
   * getProvinceData
   */
  public getProvinceData(id: number, countryCode: string, lang: string) {
    if (!lang) { lang = '' };
    var query = '?lang=' + lang;
    if (id) {
      query = query + '&id=' + id;
    } else {
      if (countryCode) {
        query = query + '&country=' + countryCode;
      }
    }
    const url = this.nodeApi.baseUrl.server + 'locations/get-province-data' + query;
    return this.http.get<any>(url);
  }

  /**
   * getApiData
   */
  public getApiData(apiUrl) {
    return this.http.get<any>(apiUrl);
  }

  /**
   * themeSettings
   */
  public settingTheme(themeSettings) {
    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      themeSettings: themeSettings
    }
    const url = this.baseUrl + this.nodeApi.apiUrls.webServices.base + '/theme-settings';
    const params = new HttpParams().set('data', JSON.stringify(data));
    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      params: params
    };
    return this.http.post<any>(url, null, httpOptions);
  }

  /**
   * login
   */
  public userLogin(dataPost) {
    const data = {
      secur_key: this.nodeApi.api_key,
      username: dataPost.username,
      password: dataPost.password,
      onStatus: 'online',
      userLevel: dataPost.userLevel
    }
    const url = this.nodeApi.baseUrl.server + this.nodeApi.apiUrls.accounts + '/login';
    const params = new HttpParams().set('data', JSON.stringify(data));
    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      params: params
    };
    return this.http.post<any>(url, null, httpOptions);
  }

  /**
   * checkUserLogin
   */
  public checkUserLogin(dataPost) {
    const data = {
      secur_key: this.nodeApi.api_key,
      username: dataPost.username,
      login_code: dataPost.login_code,
      onStatus: 'online',
      userLevel: dataPost.userLevel
    }
    const url = this.nodeApi.baseUrl.server + this.nodeApi.apiUrls.accounts + '/check-login';
    const params = new HttpParams().set('data', JSON.stringify(data));
    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      params: params
    };
    return this.http.post<any>(url, null, httpOptions);
  }

  /**
   * setUserData
   */
  public setUserData(userData) {
    var agency_code = userData.agency_code;
    if (!agency_code) {
      agency_code = 'admins';
    }

    var avatarLink = userData.avatarLink;
    if (!avatarLink) {
      if (userData.userLevel === 'admins') {
        avatarLink = this.setFileLink(userData.avatar, this.memberAvatar.admins);
      } else if (userData.userLevel === 'users') {
        avatarLink = this.setFileLink(userData.avatar, this.memberAvatar.users);
      } else if (userData.userLevel === 'members') {
        const uploadPath = this.filesStorages.server + '/' + this.databaseName + '/members';
        avatarLink = this.setFileLink(userData.avatar, uploadPath);
      } else {
        avatarLink = this.setFileLink(userData.avatar, null);
      }
    }

    if (!userData.company) {
      userData.company = {
        name: userData.coName,
        address: userData.coAdd,
        taxCode: userData.coCode
      }
    }

    if (userData.userLevel === 'admins' && userData.level === 'admin') {
      var webAdmin = true;
    } else {
      if (userData.agency_code === this.agency_code && userData.level === 'supper_admin') {
        var webAdmin = true;
      } else {
        const webAdmins = this.isJSON(userData.webAdmins);
        if (webAdmins) {
          const rs = webAdmins.find(item => item === this.domain);
          if (rs) {
            var webAdmin = true;
          } else {
            var webAdmin = false;
          }
        } else {
          var webAdmin = false;
        }
      }
    }

    const data = {
      type: userData.type,
      agency_code: agency_code,
      username: userData.username,
      nickname: userData.nickname,
      fullname: userData.fullname,
      title: userData.title,
      avatar: userData.avatar,
      avatarLink: avatarLink,
      national: userData.national,
      tels: this.isArray(userData.tels).data,
      emails: this.isArray(userData.emails).data,
      location: userData.location,
      address: userData.address,
      company: userData.company,
      position: userData.position,
      workplace: userData.workplace,
      level: userData.level,
      permissions: userData.permissions,
      webAdmin: webAdmin,
      userLevel: userData.userLevel,
      provider: userData.provider,
      status: userData.status
    }
    this.userData = data;
    return data;
  }

  /**
   * memberLogin
   */
  public memberLogin(data) {
    const query = JSON.stringify({
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      username: data.username,
      password: data.password,
      login_code: data.login_code,
      status: data.status
    });
    const url = this.nodeApi.baseUrl.server + this.nodeApi.apiUrls.webServices.base + '/member-login?data=' + query;
    return this.http.get<any>(url);
  }

  /**
   * clientLogin
   */
  public clientLogin() {
    // For account of this website only
  }

  /**
   * logOut
   */
  public logOut() {
    if (typeof (Storage) !== "undefined") {
      const isLoged = JSON.parse(localStorage.getItem('isLoged'));
      isLoged.status = false;
      localStorage.setItem('isLoged', JSON.stringify(isLoged));
    }

    this.userData = {};
    return null;
  }

  /**
   * createMember
   */
  public createMember(formData): Promise<any> {
    const name = {
      fullname: formData.name
    };

    const personal_info = {
      title: formData.title,
      location: formData.location,
      address: formData.address
    };

    var tels = [];
    var emails = [];
    if (formData.tel) { var tels = [formData.tel] };
    if (formData.email) { var emails = [formData.email] };
    const contact_info = {
      tels: tels,
      emails: emails
    };

    const company_info = formData.company;

    const user = {
      ip: this.geoIp.ip,
      userAgent: this.userAgent
    }

    const fields = {
      username: formData.username,
      password: formData.password,
      name: JSON.stringify(name),
      personal_info: JSON.stringify(personal_info),
      contact_info: JSON.stringify(contact_info),
      company_info: JSON.stringify(company_info),
      createdTime: new Date(),
      user: JSON.stringify(user)
    }

    const data = {
      api_key: this.nodeApi.api_key,
      domain: this.domain,
      fields: fields
    }
    const url = this.nodeApi.baseUrl.server + this.nodeApi.apiUrls.webServices.base + '/create-member';
    const params = new HttpParams().set('data', JSON.stringify(data));
    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      params: params
    };

    return this.http.post<any>(url, null, httpOptions).toPromise().then(res => res).catch(err => err);
  }

  /**
   * getMembers
   */
  public getMembers(username) {
    if (!username) { username = '' };
    const query = '?api_key=' + this.nodeApi.api_key + '&domain=' + this.domain + '&username=' + username;
    const url = this.nodeApi.baseUrl.server + this.nodeApi.apiUrls.webServices.base + '/get-members' + query;
    return this.http.get<any>(url);
  }

  /**
   * getUsers
   */
  public getUsers() {
    var baseUrl = this.nodeApi.baseUrl.server;
    const url = baseUrl + this.nodeApi.apiUrls.webServices.base + '/get-users/' + this.agency_code;
    return this.http.get<any>(url);
  }

  /**
   * getFileSrc
   */
  public getFileSrc(value: string, uploadPath: string) {
    const baseLink = this.filesStorage + '/' + this.domain + '/' + uploadPath;
    return this.setFileLink(value, baseLink);
  }

  /**
   * setFileLink
   */
  public setFileLink(value: string, baseLink: string) {
    if (value) {
      const data = this.isJSON(value);
      if (data) {
        if (data.type === 'href') {
          return data.value;
        } else if (data.type === 'iframe' || data.type === 'base64') {
          return data;
        } else {
          return baseLink + '/' + data.value;
        }
      } else {
        return baseLink + '/' + value;
      }
    } else {
      return '';
    }
  }

  /**
   * getUserAvatar
   */
  public getUserAvatar(avatar, userLevel) {
    if (userLevel === 'admins') {
      var uploadPath = this.memberAvatar.admins;
    } else {
      var uploadPath = this.memberAvatar.users;
    }
    return this.getFileSrc(avatar, uploadPath);
  }

  /**
   * isVietnamese
   */
  public isVietnamese(string: string) {
    const arr = ['à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ',
      'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ',
      'ì', 'í', 'ị', 'ỉ', 'ĩ',
      'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ',
      'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ',
      'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ',
      'đ'];
    if (string) {
      const value = string.toLowerCase();
      const rs = [];
      arr.forEach(item => {
        const index = value.indexOf(item);
        if (index !== -1) {
          rs.push(item);
        }
      });
      if (rs.length > 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  /**
   * bodauTiengViet
   */
  public bodauTiengViet(string: string) {
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
    } else {
      return '';
    }
  }

  /**
   * getStringtify
   */
  public getStringtify(string: string) {
    if (string) {
      string = this.bodauTiengViet(string);
      string = string.replace(/ /g, "");
      string = string.replace(/-/g, "");
      string = string.toLowerCase();
      return string;
    } else {
      return '';
    }
  }

  /**
   * getLink
   */
  public getLink(string: string) {
    if (string) {
      string = this.bodauTiengViet(string);
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
    } else {
      return '';
    }
  }

  /**
   * getlangContent
   */
  public getLanguageValue(string: string, lang: string) {
    if (string) {
      const arr = this.isJSON(string);
      if (arr) {
        const rs = arr.find(item => item.lang === lang);
        if (rs) {
          return rs.content;
        } else {
          return 'No data for language = ' + lang + '!';
        }
      } else {
        return string;
      }
    } else {
      return null;
    }
  }

  /**
   * getModuleRoute
   */
  public getModuleRoute(lang: string) {
    const rs = this.moduleRoutes.find(item => item.lang === lang);
    if (rs) {
      return rs.routes;
    }
    return this.moduleRoutes[0].routes;
  }

  /**
   * getPageContacts
   */
  public getPageContacts(data: any) {
    // data: {
    //   siteValues: any,
    //   data: any,
    //   alias: string,
    //   telZero: boolean,
    //   codeAndNumberSeparate: string or boolean
    // }

    var siteValues = data.siteValues;
    if (!siteValues) {
      // console.log('No siteValues!');
      return null;
    } else {
      var contactInfos = {
        tels: [],
        hotlines: [],
        callcenters: [],
        emails: []
      };
  
      var zero = '';
      if (data.telZero) {
        zero = '0';
      }
  
      var codeAndNumberSeparate = '';
      if (data.codeAndNumberSeparate) {
        if (typeof data.codeAndNumberSeparate === 'string') {
          codeAndNumberSeparate = data.codeAndNumberSeparate;
        } else {
          codeAndNumberSeparate = ' ';
        }
      }
      
      if (siteValues.telArr) {
        var telAlias = data.alias;
        if (this.isArray(data.alias).err) {
          const telRs = siteValues.telArr.find(item => item.alias === telAlias);
          if (!telRs) {
            telAlias = ['main'];
          } else {
            telAlias = [data.alias];
          }
        }
        siteValues.telArr.forEach(e => {
          var tel = this.setTelValues(e, zero, data.showDialCode, codeAndNumberSeparate);
          if (data.alias === 'all') {
            contactInfos.tels.push(tel);
          } else {
            const rs = telAlias.find(item => item === e.alias);
            if (rs && e.value) {
              contactInfos.tels.push(tel);
            }
          }
        });
      }
  
      if (siteValues.hotlineArr) {
        var hotlineAlias = data.alias;
        if (this.isArray(data.alias).err) {
          const hotlineRs = siteValues.hotlineArr.find(item => item.alias === hotlineAlias);
          if (!hotlineRs) {
            hotlineAlias = ['main'];
          } else {
            hotlineAlias = [data.alias];
          }
        }
        siteValues.hotlineArr.forEach(e => {
          var hotline = this.setTelValues(e, zero, data.showDialCode, codeAndNumberSeparate);
          if (data.alias === 'all') {
            contactInfos.hotlines.push(hotline);
          } else {
            const rs = hotlineAlias.find(item => item === e.alias);
            if (rs && e.value) {
              contactInfos.hotlines.push(hotline);
            }
          }
        });
      }
  
      if (siteValues.callcenterArr) {
        var callcenterAlias = data.alias;
        if (this.isArray(data.alias).err) {
          const callcenterRs = siteValues.callcenterArr.find(item => item.alias === callcenterAlias);
          if (!callcenterRs) {
            callcenterAlias = ['main'];
          } else {
            callcenterAlias = [data.alias];
          }
        }
        siteValues.callcenterArr.forEach(e => {
          if (data.alias === 'all') {
            contactInfos.callcenters.push(e);
          } else {
            const rs = callcenterAlias.find(item => item === e.alias);
            if (rs && e.value) {
              contactInfos.callcenters.push(e);
            }
          }
        });
      }
  
      if (siteValues.emailArr) {
        var emailAlias = data.alias;
        if (this.isArray(data.alias).err) {
          const emailRs = siteValues.emailArr.find(item => item.alias === emailAlias);
          if (!emailRs) {
            emailAlias = ['main'];
          } else {
            emailAlias = [data.alias];
          }
        }
        siteValues.emailArr.forEach(e => {
          if (data.alias === 'all') {
            contactInfos.emails.push(e);
          } else {
            const rs = telAlias.find(item => item === e.alias);
            if (rs && e.value) {
              contactInfos.emails.push(e);
            }
          }
        });
      }
  
      return contactInfos;
    }

  }

  /**
   * setTelValues
   */
  public setTelValues(tel: any, zero: string, dialCode: boolean, codeAndNumberSeparate: string) {
    if (tel.value) {
      var string = tel.value.number;
      if (string) {
        const index = string.indexOf('0');
        if (index === 0) {
          string = string.replace('0', '');
        }
        const value = string.replace(/ /g, '');

        var showValue = zero + string;
        if (dialCode) {
          showValue = '+' + tel.value.code + codeAndNumberSeparate + string;
        }

        return {
          title: tel.title,
          dialCode: tel.value.code,
          value: '+' + tel.value.code + value,
          showValue: showValue
        }
      }
      return {}
    } 
    return {}
  }

  /**
   * checkEmail
   */
  public checkEmail(email: string) {
    if (email) {
      const mailArr = email.split(' ');
      if (mailArr.length > 1) {
        var result = {
          mess: 'fail',
          content: [
            {
              lang: 'vi',
              value: 'Email không được có khoảng trắng!'
            }, {
              lang: 'en',
              value: 'Email can not contain blank characters!'
            }
          ]
        }
      } else {
        const mailArr2 = email.split('@');
        if (mailArr2.length == 2) {
          if (!mailArr2[0]) {
            var result = {
              mess: 'fail',
              content: [
                {
                  lang: 'vi',
                  value: 'Trước @ phải có tên email!'
                }, {
                  lang: 'en',
                  value: 'Before @ must have an email name!'
                }
              ]
            }
          } else {
            if (!mailArr2[1]) {
              var result = {
                mess: 'fail',
                content: [
                  {
                    lang: 'vi',
                    value: 'Sau @ phải có tên miền!'
                  }, {
                    lang: 'en',
                    value: 'After @ must have a domain name!'
                  }
                ]
              }
            } else {
              const doamainArr = mailArr2[1].split('.');
              if (doamainArr.length < 2 || doamainArr.length > 3) {
                var result = {
                  mess: 'fail',
                  content: [
                    {
                      lang: 'vi',
                      value: 'Tên miền không hợp lệ!'
                    }, {
                      lang: 'en',
                      value: 'Domain is not valid!'
                    }
                  ]
                }
              } else {
                if (!doamainArr[doamainArr.length - 1]) {
                  var result = {
                    mess: 'fail',
                    content: [
                      {
                        lang: 'vi',
                        value: 'Tên miền không hợp lệ!'
                      }, {
                        lang: 'en',
                        value: 'Domain is not valid!'
                      }
                    ]
                  }
                } else {
                  var result = {
                    mess: 'ok',
                    content: [
                      {
                        lang: 'vi',
                        value: 'Email hợp lệ!'
                      }, {
                        lang: 'en',
                        value: 'Email is valid!'
                      }
                    ]
                  }
                }
              }
            }
          }
        } else if (mailArr2.length > 2) {
          var result = {
            mess: 'fail',
            content: [
              {
                lang: 'vi',
                value: 'Email chỉ được có 1 @!'
              }, {
                lang: 'en',
                value: 'Email must have one @ only!'
              }
            ]
          }
        } else {
          var result = {
            mess: 'fail',
            content: [
              {
                lang: 'vi',
                value: 'Email phải có @!'
              }, {
                lang: 'en',
                value: 'Email must have @!'
              }
            ]
          }
        }
      }
    } else {
      var result = {
        mess: 'noEmail',
        content: [
          {
            lang: 'vi',
            value: 'Nhập địa chỉ Email!'
          }, {
            lang: 'en',
            value: 'Enter your Email!'
          }
        ]
      }
    }
    return result;
  }

  /**
   * minusDates
   */
  public minusDates(a: Date, b: Date) {
    const aY = a.getFullYear();
    const aMonth = a.getMonth() + 1;
    var aM = aMonth.toString();
    if (aMonth < 10) {
      aM = '0' + aM;
    }
    const aDate = a.getDate();
    var aD = aDate.toString();
    if (aDate < 10) {
      aD = '0' + aD;
    }
    var aTime = new Date(aY + '-' + aM + '-' + aD);

    const bY = b.getFullYear();
    const bMonth = b.getMonth() + 1;
    var bM = bMonth.toString();
    if (bMonth < 10) {
      bM = '0' + bM;
    }
    const bDate = b.getDate();
    var bD = bDate.toString();
    if (bDate < 10) {
      bD = '0' + bD;
    }
    var bTime = new Date(bY + '-' + bM + '-' + bD);

    const rs = aTime.getTime() - bTime.getTime();
    return rs;
  }

  /**
   * randomArray
   */
  public randomArray(array: any[]) {
    return array.sort(() => 0.5 - Math.random());
  }

  /**
   * getArrayRandom
   */
  public getArrayRandom(array: any[], number: number) {
    array = this.randomArray(array);
    const data = [];
    array.forEach((e, index) => {
      if (index < number) {
        data.push(e);
      }
    });
    return data;
  }

  /**
   * sumArray
   */
  public sumArray(array: any[]) {
    return array.reduce((a, b) => a + b, 0);
  }

  /**
   * countaverage
   */
  public countAverage(array: any[]) {
    const total = this.sumArray(array);
    return total / array.length;
  }

  /**
   * isJSON
   */
  public isJSON(value: any) {
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

  /**
   * isArray
   */
  public isArray(value: any) {
    const JSON = this.isJSON(value);
    if (Array.isArray(JSON)) {
      return {
        data: JSON
      }
    } 
    return {
      data: [],
      err: 'Value is not a, Array',
      value: value
    };
  }

  /**
   * isObject
   */
  public isObject(value: any) {
    const JSON = this.isJSON(value);
    if (JSON) {
      if (Array.isArray(JSON)) {
        return {
          err: 'Value is not an Object, it is a Array',
          value: JSON
        }
      }
      return JSON;
    } 
    return {
      err: 'Value is not a JSON',
      value: value
    }
  }

  /**
   * objectToArray
   */
  public objectToArray(data: any) {
    const object = this.isObject(data);
    const array = Object.entries(object);
    const arr = [];
    array.forEach(e => {
      const obj = {
        key: e[0],
        value: e[1]
      }
      arr.push(obj);
    });
    return arr;
  }

  /**
   * arrayToObject
   */
  public arrayToObject(array: any[]) {
    const arr = this.isArray(array).data;
    var data = {};
    arr.forEach(item => {
      const values = Object.values(item);
      const key = values[0].toString();
      const obj = {};
      obj[key] = values[1];
      data = Object.assign(data, obj);
    });
    return data;
  }

  /**
   * sortArray
   */
  public sortArray(array: any[], options) {
    const compare = (a, b) => {
      if (options.field === 'sortNum') {
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

  /**
   * renderPageData
   */
   public renderPageData(data: any, uploadPath: string) {
    if (data.avatar) {
      data.avatarUrl = this.getFileSrc(data.avatar, uploadPath);
    }
    if (data.cover) {
      data.coverUrl = this.getFileSrc(data.cover, uploadPath);
    }

    data.JSON = this.isObject(data.jsonData);
    if (data.JSON.continueBtn) {
      data.continueBtn = data.JSON.continueBtn;
    }

    if (data.destination) {
      data.desData = this.isObject(data.destination);
    }

    if (data.icon) {
      data.iconData = this.isObject(data.icon);
    }

    if (data.caption) {
      data.caption = data.caption.replace(/#brandName/g, this.appName);
    }

    if (data.content) {
      data.content = data.content.replace(/#brandName/g, this.appName);
    }

    if (data.contacts) {
      data.contacts = this.isObject(data.contacts);
    }
  }
  
}
