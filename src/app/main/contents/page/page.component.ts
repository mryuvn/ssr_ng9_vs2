import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subscription, of } from 'rxjs';

import { SetTagsService } from 'src/app/services/set-tags.service';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { LanguageService } from 'src/app/services/language.service';
import { PageService } from './page.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  socket: any;
  myObserve: any;

  params: any = {};

  lang: string;
  
  langData: any = {};
  langsData: any = [
    {
      lang: 'vi',
    },
    {
      lang: 'en',
    }
  ];
  langContent: any = {};

  dateFormat: string;

  tables = {
    manager: '',
    posts: ''
  }
  uploadPath: string;

  siteValues: any = {};
  
  // MODULES: any = [];

  moduleRoute: string;
  moduleData: any = {};

  parentCats: any = {};
  sameCats: any = [];
  childCats: any = [];

  POSTS: any = [];
  data: any = {};
  articles: any = [];

  imageSource: any = [];
  isBrowser: boolean;
  navIsFixed: boolean;
  routerLoading: boolean;
  routerLoaded: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private setTagsService: SetTagsService,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService,
    private pageService: PageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitDataSearchResult) {
        this.data.mess = message.data.mess;
        this.articles = message.data.articles;
      }

      if (message.text === messageService.messages.changeLanguage) {
        const newLang = message.data;
        if (this.moduleData.id) {
          this.renderModuleData(this.moduleData, newLang);

          let route = '/' + message.data;
          if (this.params.moduleRoute) {
            const moduleRoute = this.findModuleRoute(this.moduleData);
            if (moduleRoute) {
              route = route + '/' + moduleRoute;
              if (this.params.pageID && this.data.id) {
                const data = this.POSTS.find((item: any) => item.managerID === this.data.managerID && item.lang === newLang);
                if (data) {
                  const pageID = this.moduleData.config.getDataByPath ? data.path : data.id;
                  route = route + '/' + pageID;
                  if (!this.moduleData.config.getDataByPath) {
                    const path = data.path ? data.path : appService.getLink(data.name);
                    route = route + '/' + path;
                  }
                }
              }
            }
          }
          router.navigate([route]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.isBrowser = this.appService.isBrowser;
    this.params = this.route.snapshot.params;
    this.lang = this.route.snapshot.params.lang;
    this.appService.sitelang = this.lang;
    this.getLangData();

    this.routerLoading = true;

    this.moduleRoute = this.params.moduleRoute;

    this.getDomainData();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.routerLoading = true;
        this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
        this.routerLoaded = false;

        
            
        const params = val.state.root.firstChild?.firstChild?.params;
        if (params) {
          const noChangeModuleRoute = params.moduleRoute && this.params.moduleRoute || !params.moduleRoute && !this.params.moduleRoute;
          const noChangePageID = params.pageID && this.params.pageID || !params.pageID && !this.params.pageID;
          const noChangePath = params.path && this.params.path || !params.path && !this.params.path;
          if (noChangeModuleRoute && noChangePageID && noChangePath) {
            this.params = params;
            if (params.moduleRoute === this.moduleRoute) {
              if (this.moduleData.id) {
                this.getPageData();
              } else {
                this.findModuleData();
              }
            } else {
              this.moduleRoute = params.moduleRoute;
              this.findModuleData();
            }

            const lang = val.state.root.firstChild.params.lang;
            if (lang !== this.lang) {
              this.lang = lang;
              this.appService.sitelang = this.lang;
              this.getLangData();
              this.getSiteData();
              this.renderModuleData(this.moduleData, lang);
            }
          }
        }
      }
    });
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.dateFormat = this.langData.dateFormat;
  }

  setGlobalStyles() {
    if (this.isBrowser) {
      const layoutSettings = this.appService.domainData.layoutSettings;
      
      const colors = layoutSettings.colors;
  
      let primary = colors?.primary;
      if (!primary) { primary = { hex: '#263238' } };
      const primaryColor = primary.rgba ? primary.rgba : primary.hex;
  
      let accent = colors?.accent;
      if (!accent) { accent = { hex: '#0288d1' } };
      const accentColor = accent.rgba ? accent.rgba : accent.hex;
  
      let warn = colors?.warn;
      if (!warn) { warn = { hex: '#c62828' } };
      const warnColor = warn.rgba ? warn.rgba : warn.hex;
  
      let light = colors?.light;
      if (!light) { light = { hex: '#e3f2fd' } };
      const lightColor = light.rgba ? light.rgba : light.hex;
  
      let background = colors?.background;
      if (!background) { background = { hex: '#bbdefb' } };
      const backgroundColor = background.rgba ? background.rgba : background.hex;

      let fontFamily = layoutSettings.fontFamily ? layoutSettings.fontFamily : 'Mitr';
      let fontSize = layoutSettings.fontSize ? layoutSettings.fontSize : '16 px';
      let fontWeight = layoutSettings.fontSize ? layoutSettings.fontSize : 300;

      const wrapper = document.getElementById('wrapper') as HTMLElement;
      wrapper?.style.setProperty('--primaryColor', primaryColor);
      wrapper?.style.setProperty('--accentColor', accentColor);
      wrapper?.style.setProperty('--warnColor', warnColor);
      wrapper?.style.setProperty('--lightColor', lightColor);
      wrapper?.style.setProperty('--backgroundColor', backgroundColor);
      wrapper?.style.setProperty('--fontFamily', fontFamily);
      wrapper?.style.setProperty('--fontSize', fontSize);
      wrapper?.style.setProperty('--fontWeight', fontWeight);
    }
  }

  getSiteData() {
    const getData = (data: any) => {
      return data.find((item: any) => item.lang === this.lang);
    }
    const domainData = this.appService.domainData;
    const language = getData(domainData.languages);
    if (language) { this.siteValues = language };

    const menu = getData(domainData.menu);

    const data = {
      siteValues: language,
      menu: menu?.data
    }
    this.messageService.sendMessage(this.messageService.messages.emitSiteData, data);
  }

  getDomainData() {
    if (this.appService.domainData) {
      this.getSiteData();
      this.getModuleData();
    } else {
      this.appService.getDomainData().subscribe(res => {
        if (res.mess === 'ok') {
          this.appService.domainData = res.data;
          this.setGlobalStyles();
          this.getSiteData();
          this.getModuleData();
        } else {
          console.log(this.appService.getErr(res.err, 'getDomainData()', 'PageComponent'));
        }
      }, err => {
        console.log(this.appService.getErr(err, 'getDomainData()', 'PageComponent'));
      });
    }
  }

  getModuleData() {
    if (this.pageService.MODULES) {
      this.findModuleData();
    } else {
      this.appService.getSqlData({
        table: this.appService.tables.categories,
        where: 'WHERE enabled = 1'
      }).subscribe(res => {
        if (res.mess === 'ok') {
          res.data.forEach((e: any) => {
            this.renderModuleData(e, this.lang);
          });
          this.pageService.MODULES = res.data;
          this.findModuleData();
        } else {
          console.log(this.appService.getErr(res.err, 'getModuleData()', 'PageComponent'));
          this.data = this.languageService.getLoadingErr(this.lang);
          this.dataLoaded();
        }
      }, err => {
        console.log(this.appService.getErr(err, 'getModuleData()', 'PageComponent'));
        this.data = this.languageService.getLoadingErr(this.lang);
        this.dataLoaded();
      });
    }
  }

  renderModuleData(e: any, lang: string) {
    e.nameValue = this.languageService.getLangValue(e.name, lang);
    e.config = this.appService.isObject(e.moduleConfig).data;
    const langContent = this.languageService.getLangValue(e.moduleData, lang);
    e.langContent = this.appService.isObject(langContent).data;
    e.moduleRoutes = this.appService.isArray(e.moduleRoutes).data;
    e.route = this.findModuleRoute(e);
  }

  findModuleRoute(e: any) {
    const route = e.moduleRoutes.find((item: any) => item.lang === this.lang);
    return route?.content;
  }

  findModuleData() {
    let e: any;
    if (this.moduleRoute) {
      e = this.pageService.MODULES.find((item: any) => item.route === this.moduleRoute);
    } else {
      e = this.pageService.MODULES.find((item: any) => item.alias === 'home_page');
    }

    if (e) {
      this.moduleData = e;
      // console.log(this.moduleData);

      this.tables.manager = e.db_table_basename + 'manager';
      this.tables.posts = e.db_table_basename + 'list';
      this.getPageData();
    } else {
      this.moduleData = {};
      this.data = this.languageService.getPageNotFound(this.lang);
      this.dataLoaded();
    }
  }

  getPageData() {
    const catData = {
      id: this.moduleData.id,
      alias: this.moduleData.alias,
      manager: this.tables.manager,
      posts: this.tables.posts
    };
    this.appService.getPageData(catData).subscribe(res => {
      if (res.mess === 'ok') {
        this.POSTS = res.data;
        this.renderData();

        const postsData = {
          cat: this.moduleData.cat,
          data: res.data
        }
        this.pageService.POSTS.push(postsData);
      } else {
        console.log(this.appService.getErr(res.err, 'getDomainData()', 'PageComponent'));
        this.data = this.languageService.getLoadingErr(this.lang);
        this.dataLoaded();
      }
    }, err => {
      console.log(this.appService.getErr(err, 'getDomainData()', 'PageComponent'));
      this.data = this.languageService.getLoadingErr(this.lang);
      this.dataLoaded();
    });
  }

  renderData() {
    const general = this.POSTS.find((item: any) => item.alias === 'general' && item.lang === this.lang);
    if (general) {
      if (this.params.pageID) {
        const post = this.POSTS.find((item: any) => item.id == this.params.pageID && item.lang === this.lang);
        if (post) {
          this.data = post;
        } else {
          this.data = this.languageService.getPageNotFound(this.lang);
        }
      } else {
        this.data = general;
      }
    } else {
      this.data = this.languageService.getPageNotFound(this.lang);
    }
    this.dataLoaded();
  }

  dataLoaded() {
    this.updateTags();

    setTimeout(() => {
      this.routerLoading = false;
      this.routerLoaded = true;
      this.messageService.sendMessage(this.messageService.messages.layoutLoaded, null);
      this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
    }, 300);
  }
  

  updateTags() {
    let seoTags = this.siteValues.seoTags;
    if (!seoTags) { seoTags = {}; }
    
    if (this.moduleData.alias === 'home_page') {
      var title = seoTags.title;
    } else {
      var title = this.data.title ? this.data.title : this.data.name;
    }
    const siteName = this.siteValues.name ? this.siteValues.name : this.appService.siteName;
    title = siteName + ' | ' + title;

    var description = this.data.description;
    if (!description) { description = seoTags.description };

    var image = this.data.avatarUrl;
    if (!image) {
      image = 'https://' + this.appService.domain + '/' + this.appService.webAvatar;
    }

    const data = {
      title: title,
      description: description,
      dcTitle: title,
      image: image,
      type: null
    }
    this.setTagsService.updateTags(data);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 650) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 650) {
      this.navIsFixed = false;
    }
  }

  ngOnDestroy(): void {
    this.setTagsService.removeTags();
    this.subscription.unsubscribe();
    if (this.socket) {
      this.socket.unsubscribe();
    }
    if (this.myObserve) {
      this.myObserve.unsubscribe();
    }
  }

}
