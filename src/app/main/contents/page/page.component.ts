import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Subscription, of } from 'rxjs';

import { SetTagsService } from 'src/app/services/set-tags.service';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { LanguageService } from 'src/app/services/language.service';

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
  siteValues: any = {};
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
    cat: '',
    manager: '',
    posts: '',
    contents: ''
  }
  uploadPath: string;

  MODULES: any = [];
  moduleData: any = {
    config: {},
    contentData: {},
    aliasData: []
  };
  childCats: any = [];
  sameCats: any = [];
  parentCat: any = {};

  pageConfig: any = {};

  siteTitle: string;
  siteCaption: string;
  pageTitle: string;
  pageCover: string;

  DATA: any = [];
  generalData: any = {};
  data: any = {};
  contents: any = [];
  tabs: any = [];
  articles: any = [];
  error: string;

  isBrowser: boolean;
  showLazy: Boolean;
  navIsFixed: boolean;
  routerLoaded: boolean;

  imageSource: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private setTagsService: SetTagsService,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitDataSearchResult) {
        this.data.mess = message.data.mess;
        this.articles = message.data.articles;
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;

      this.socket = this.socketioService.on(this.socketioService.messages.userActions.checkConnecting).subscribe(data => {
        if (this.error === 'getSiteValues') {
          this.getSiteValues();
        } else if (this.error === 'getModuleData') {
          this.getModuleData();
        } else if (this.error === 'getPageData') {
          this.getPageData();
        } else if (this.error === 'getContents') {
          this.getContents();
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = this.socketioService.on(this.socketioService.messages.domains.edit).subscribe(content => {
        if (content.data.id === this.appService.domainID) {
          this.getSiteValues();
        }
      }, err => console.log({ err: err, time: new Date() }));

      const messages = {
        newCat: socketioService.messages.posts.newCat + '_' + appService.domain,
        editCat: socketioService.messages.posts.editCat + '_' + appService.domain,
        deleteCat: socketioService.messages.posts.deleteCat + '_' + appService.domain,
        newPost: socketioService.messages.posts.newPostList + '_' + appService.domain,
        editPost: socketioService.messages.posts.editPostList + '_' + appService.domain,
        deletePost: socketioService.messages.posts.deletePostList + '_' + appService.domain,
        updateContents: socketioService.messages.posts.updateContents + '_' + appService.domain
      }

      this.socket = socketioService.on(messages.newCat).subscribe(content => {
        if (this.error) {
          this.getSiteValues();
        } else {
          const e = content.newData;
          this.renderModuleData(e);
          this.MODULES.push(e);
          if (e.alias === this.moduleData.alias) {
            const moduleData = this.MODULES.find(item => item.route === this.params.moduleRoute && item.enabled);
            if (moduleData) {
              this.moduleData = moduleData;
              messageService.sendMessage(messageService.messages.updateModuleData, null);
              this.emitPageFullscreen();
              this.getPageData();
              this.messageService.sendMessage(this.messageService.messages.updatePageData, null);
              this.renderCategories();
              this.messageService.sendMessage(this.messageService.messages.updateCats, null);
            }
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.editCat).subscribe(content => {
        if (this.error) {
          this.getSiteValues();
        } else {
          var arr = content.dataArr;
          if (!arr) {
            arr = [content.data];
          }
          arr.forEach(e => {
            const index = this.MODULES.findIndex(item => item.id === e.id);
            if (index !== -1) {
              this.renderModuleData(e);
              this.MODULES.splice(index, 1, e);
            }
          });
          const moduleData = this.MODULES.find(item => item.route === this.params.moduleRoute && item.enabled);
          if (moduleData) {
            this.moduleData = moduleData;
            messageService.sendMessage(messageService.messages.updateModuleData, null);
            this.emitPageFullscreen();
            if (!this.data.id) {
              this.getPageData();
              this.messageService.sendMessage(this.messageService.messages.updatePageData, null);
            } else {
              this.setPageConfig();
            }
            messageService.sendMessage(messageService.messages.getPageConfig, null);
            this.renderCategories();
            this.messageService.sendMessage(this.messageService.messages.updateCats, null);
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.deleteCat).subscribe(content => {
        if (this.error) {
          this.getSiteValues();
        } else {
          const index = content.dataArr.findIndex(item => item.id === this.moduleData.id);
          if (index !== -1) {
            this.MODULES.splice(index, 1);
            this.renderCategories();
            this.messageService.sendMessage(this.messageService.messages.updateCats, null);
          }
          //...
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.newPost).subscribe(content => {
        if (content.table === this.tables.posts) {
          const e = content.newData;
          if (e.cat === this.moduleData.alias && e.lang === this.lang) {
            this.DATA.push(e);
            this.renderData();
            this.messageService.sendMessage(this.messageService.messages.updatePageData, null);
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.editPost).subscribe(content => {
        if (content.table === this.tables.posts && content.catAlias && content.lang === this.lang) {
          var arr = content.dataArr;
          if (!arr) {
            arr = [content.data];
          }
          const edited = [];
          arr.forEach(e => {
            const index = this.DATA.findIndex(item => item.id === e.id);
            if (index !== -1) {
              edited.push(e);
              this.DATA.splice(index, 1, e);
            }
          });
          if (edited.length > 0) {
            this.renderData();
            this.messageService.sendMessage(this.messageService.messages.updatePageData, null);
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.deletePost).subscribe(content => {
        const deleted = [];
        content.dataArr.forEach(e => {
          const index = this.DATA.findIndex(item => item.id === e.id);
          if (index !== -1) {
            deleted.push(e);
            this.DATA.splice(index, 1);
          }
        });
        if (deleted.length > 0) {
          this.renderData();
          this.messageService.sendMessage(this.messageService.messages.updatePageData, null);
        }
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  ngOnInit(): void {
    this.params = this.route.snapshot.params;
    this.lang = this.route.snapshot.params.lang;
    this.getLangData();

    this.tables.cat = this.appService.tables.posts.cats;

    const siteValues = this.appService.siteValues.find(item => item.lang === this.lang);
    if (siteValues) {
      this.siteValues = siteValues;
      if (this.siteValues.dateFormat) {
        this.dateFormat = this.siteValues.dateFormat;
      }
      this.getModuleData();
    } else {
      this.getSiteValues();
    }

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
        }

        this.data = {};
        const params = val.state.root.firstChild.firstChild.firstChild.params;
        // console.log(params);
        if (params) {
          this.params = params;
          this.moduleData = {
            config: {},
            contentData: {},
            aliasData: []
          };
          this.pageConfig = {};
          const moduleData = this.MODULES.find(item => item.route === this.params.moduleRoute && item.enabled);
          if (moduleData) {
            this.moduleData = moduleData;
            // console.log(this.moduleData);

            this.emitPageFullscreen();
            this.renderCategories();

            this.tables.manager = moduleData.db_table_basename + 'manager';
            this.tables.posts = moduleData.db_table_basename + 'list';
            this.tables.contents = moduleData.db_table_basename + 'contents';
            this.uploadPath = moduleData.db_table_basename.replace(/_/g, "");
            this.getPageData();
          } else {
            this.pageNotFound();
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

  getSiteValues() {
    this.appService.getSiteValues().then(res => {
      if (res.data) {
        const siteValues = res.data.find(item => item.lang === this.lang);
        if (siteValues) {
          this.siteValues = siteValues;
          if (this.siteValues.dateFormat) {
            this.dateFormat = this.siteValues.dateFormat;
          }
          this.getModuleData();
          setTimeout(() => {
            this.showLazy = true;
          }, 1000);
        }
      } else {
        this.error = 'getSiteValues';
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.error = 'getSiteValues';
      console.log({ err: err, time: new Date() });
    });
  }

  getModuleData() {
    this.appService.getSqlData({
      table: this.tables.cat
    }).subscribe(res => {
      if (res.mess === 'ok') {
        this.MODULES = res.data;
        this.MODULES.forEach(e => {
          this.renderModuleData(e);
        });
        const moduleData = this.MODULES.find(item => item.route === this.params.moduleRoute && item.enabled);
        if (moduleData) {
          this.moduleData = moduleData;
          // console.log(this.moduleData);
          
          this.emitPageFullscreen();
          this.renderCategories();

          this.tables.manager = moduleData.db_table_basename + 'manager';
          this.tables.posts = moduleData.db_table_basename + 'list';
          this.tables.contents = moduleData.db_table_basename + 'contents';
          this.uploadPath = moduleData.db_table_basename.replace(/_/g, "");
          this.getPageData();
        } else {
          this.pageNotFound();
        }
      } else {
        this.loadingError();
        this.error = 'getModuleData';
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.loadingError();
      this.error = 'getModuleData';
      console.log({ err: err, time: new Date() });
    });
  }

  renderModuleData(e) {
    e.nameValue = this.languageService.getLangValue(e.name, this.lang);
    e.routes = this.appService.isArray(e.moduleRoutes).data;
    e.route = this.languageService.getLangValue(e.routes, this.lang);
    e.aliasData = this.appService.isArray(e.aliasTypes).data;
    e.aliasData.forEach(item => {
      if (item.config) {
        item.config = this.appService.isObject(item.config);
      }
    });
    e.config = this.appService.isObject(e.moduleConfig);

    const contentData = this.appService.isArray(e.moduleData).data;
    const rs = contentData.find(item => item.lang === this.lang);
    if (rs) {
      e.contentData = this.appService.isObject(rs.content);
    } else {
      e.contentData = {};
    }
  }

  renderCategories() {
    const childCats = [];
    const sameCats = [];
    this.MODULES.forEach(e => {
      if (e.cat === this.moduleData.id) {
        childCats.push(e);
      } else if (e.cat && e.cat === this.moduleData.cat) {
        sameCats.push(e);
      }
    });
    this.childCats = childCats;
    this.sameCats = sameCats;
    const parentCat = this.MODULES.find(item => item.id === this.moduleData.cat);
    if (parentCat) {
      this.parentCat = parentCat;
    }
  }

  getPageData() {
    let orderBy = 'ORDER BY id DESC';
    if (this.moduleData.config.orderBy) {
      orderBy = 'ORDER BY ' + this.moduleData.config.orderBy;
    }
    this.appService.getSqlData({
      table: this.tables.posts,
      where: 'WHERE cat = "' + this.moduleData.alias + '" AND lang = "' + this.lang + '"',
      orderBy: orderBy
    }).subscribe(res => {
      if (res.mess === 'ok') {
        this.DATA = res.data;
        this.renderData();
      } else {
        this.loadingError();
        this.error = 'getPageData';
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.loadingError();
      this.error = 'getPageData';
      console.log({ err: err, time: Date() });
    });
  }

  renderData() {
    this.pageTitle = null;
    const articles = [];

    this.DATA.forEach(e => {
      this.appService.renderPageData(e, this.uploadPath);

      e.route = '/' + this.lang + '/' + this.moduleData.route;
      if (e.alias !== 'general') {
        if (this.moduleData.config.getDataBy === 'path') {
          e.route = e.route + '/' + e.path;
        } else {
          var path = e.path;
          if (!path) {
            path = this.appService.getLink(e.name);
          }
          e.route = e.route + '/' + e.id + '/' + path;
        }

        if (e.alias === 'article' && e.enabled) {
          articles.push(e);
        }
      }
    });

    this.articles = articles;
    // console.log(this.articles);

    const generalData = this.DATA.find(item => item.alias === 'general');
    if (generalData) {
      this.generalData = generalData;
      this.siteTitle = generalData.name;
      this.siteCaption = generalData.caption;

      var data: any = {};
      if (this.params.pageID) {
        var pageData = {};
        if (this.moduleData.config.getDataBy === 'path') {
          pageData = this.DATA.find(item => item.path == this.params.pageID && item.enabled);
        } else {
          pageData = this.DATA.find(item => item.id == this.params.pageID && item.enabled);
        }
        if (!pageData) {
          pageData = this.languageService.getPageNotFound(this.lang);
        }
        data = pageData;
        this.pageTitle = data.name;
      } else {
        data = this.generalData;
      }

      if (data.contacts) {
        this.setContacts(data.contacts);
      }
      this.data = data;
      // console.log(this.data);

      this.updateTags();
      this.getContents();
      this.setPageConfig();

      this.pageCover = this.data.coverUrl;
      if (!this.pageCover) {
        this.pageCover = generalData.coverUrl;
      }
      if (!this.pageCover) {
        this.pageCover = 'assets/imgs/page_cover.jpg';
      }

      const imageSource = [];
      if (this.data.avatar) {
        if (typeof this.data.avatarUrl === 'string') {
          imageSource.push(this.data.avatarUrl);
        }
      }
      this.imageSource = imageSource;
      
      this.emitRouterLoaded();

      if (this.isBrowser) {
        const stateData = history.state;
        this.data.mess = stateData.mess;
        if (stateData.articles) {
          this.articles = stateData.articles;
        }
      }
      if (this.moduleData.alias === 'search' && !this.data.mess) {
        this.data.mess = this.moduleData.contentData.noResult;
      }
    } else {
      this.siteTitle = this.siteValues.name;
      this.siteCaption = this.siteValues.slogan;
      this.pageNotFound();
    }
  }

  setPageConfig() {
    var pageConfig: any = {};
    const pageAlias = this.moduleData.aliasData.find(item => item.name === this.data.alias);
    if (pageAlias) {
      if (pageAlias.config) {
        pageConfig = pageAlias.config;
      }
    }
    const moduleConfig = this.moduleData.config;
    // console.log(moduleConfig);
    
    if (!pageConfig.pageFullscreen) {
      pageConfig.pageFullscreen = moduleConfig.pageFullscreen;
    }
    if (!pageConfig.headerHeight) {
      pageConfig.headerHeight = moduleConfig.headerHeight;
    }
    if (!pageConfig.slideConfig) {
      pageConfig.slideConfig = moduleConfig.slideConfig;
    }
    if (!pageConfig.sidebar) {
      pageConfig.sidebar = moduleConfig.sidebar;
    }
    if (!pageConfig.moduleTemplate) {
      pageConfig.moduleTemplate = moduleConfig.moduleTemplate;
    }
    if (!pageConfig.avatarPosition) {
      pageConfig.avatarPosition = moduleConfig.avatarPosition;
    }
    if (!pageConfig.sameCatStyles) {
      pageConfig.sameCatStyles = moduleConfig.sameCatStyles;
    }
    if (!pageConfig.childCatStyles) {
      pageConfig.childCatStyles = moduleConfig.childCatStyles;
    }
    if (!pageConfig.postStyles) {
      pageConfig.postStyles = moduleConfig.postStyles;
    }
    if (!pageConfig.contentQuote) {
      pageConfig.contentQuote = moduleConfig.contentQuote;
    }

    this.pageConfig = pageConfig;
    // console.log(this.pageConfig);
  }

  getContents() {
    this.appService.getSqlData({
      table: this.tables.contents,
      where: 'WHERE postID = "' + this.data.id + '"'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        const imageSource = [];
        // console.log(this.imageSource);

        const contents = [];
        const tabs = [];
        res.data.forEach(e => {
          this.renderContent(e);
          if (e.isTab) {
            tabs.push(e);
          } else {
            contents.push(e);
          }
        });
        this.contents = contents;
        this.tabs = tabs;

        // if (this.contents.length > 0) {
        //   this.pageTitle = this.contents[0].title;
        // } else {
        //   this.pageTitle = null;
        // }
      } else {
        this.error = 'getContents';
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.error = 'getContents';
      console.log({ err: err, time: new Date() });
    });
  }

  renderContent(e) {
    this.appService.renderPageData(e, null);
  }

  setContacts(contacts) {
    if (contacts.telsArr) {
      contacts.tels = [];
      contacts.telsArr.forEach(e => {
        var tel: any = this.appService.setTelValues(e, '0', true, ' ');
        tel.type = 'tel';
        contacts.tels.push(tel);
      });
    }
    if (contacts.hotlinesArr) {
      contacts.hotlines = [];
      contacts.hotlinesArr.forEach(e => {
        var hotline: any = this.appService.setTelValues(e, '0', true, ' ');
        hotline.type = 'tel';
        contacts.hotlines.push(hotline);
      });
    }
    if (contacts.callcentersArr) {
      contacts.callcentersArr.forEach(e => {
        e.type = 'tel';
      });
    }
    if (contacts.emailsArr) {
      contacts.emailsArr.forEach(e => {
        e.type = 'email';
      });
    }
  }

  pageNotFound() {
    this.data = this.languageService.getPageNotFound(this.lang);
    this.siteTitle = 'Err 404';
    this.siteCaption = null;
    this.pageTitle = this.data.name;
    this.pageCover = 'assets/imgs/page_cover.jpg';
    this.contents = [];
    this.updateTags();
    this.emitRouterLoaded();
  }

  loadingError() {
    this.data = this.languageService.getLoadingErr(this.lang);
    this.siteTitle = 'Err 500';
    this.siteCaption = null;
    this.pageTitle = this.data.name;
    this.pageCover = 'assets/imgs/page_cover.jpg';
    this.contents = [];
    this.updateTags();
    this.emitRouterLoaded();
  }

  emitRouterLoaded() {
    setTimeout(() => {
      this.messageService.sendMessage(this.messageService.messages.routerLoaded, true);
      this.routerLoaded = true;
    }, 700);
  }

  updateTags() {
    var title = this.data.title;
    if (!title) { title = this.data.name };
    title = this.siteValues.name + ' | ' + title;

    var description = this.data.description;
    if (!description) { description = this.siteValues.description };

    var keywords = this.data.keywords;
    if (!keywords) { keywords = this.siteValues.keywords };

    var image = null;
    image = 'https://' + this.appService.domain + '/' + this.appService.webAvatar;
    if (this.data.avatarUrl) {
      if (typeof this.data.avatarUrl === 'string') {
        image = this.data.avatarUrl;
      }
    }

    const data = {
      title: title,
      description: description,
      keywords: keywords,
      dcTitle: title,
      image: image,
      type: null
    }
    this.setTagsService.updateTags(data);
  }

  openImageViewer(index) {
    const option = {
      images: this.imageSource,
      index: index
    }
    this.messageService.sendMessage(this.messageService.messages.openImageViewer, option);
  }

  emitPageFullscreen() {
    setTimeout(() => {
      this.messageService.sendMessage(this.messageService.messages.pageFullscreen, this.moduleData.config.pageFullscreen);
    }, 1);
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
