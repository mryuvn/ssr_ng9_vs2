import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Subscription, of } from 'rxjs';

import { SetTagsService } from 'src/app/services/set-tags.service';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { LanguageService } from 'src/app/services/language.service';
import { PageService } from './page.service';
import { LayoutService } from 'src/app/services/layout.service';
import { FilesService } from 'src/app/services/files.service';

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
      err: 'Lỗi',
      backToHome: 'Trang chủ',
      pageComments: {
        title: 'Bình luận'
      },
      faqs: {
        title: 'Câu hỏi thường gặp'
      }
    },
    {
      lang: 'en',
      err: 'Err',
      backToHome: 'Home page',
      pageComments: {
        title: 'Comments'
      },
      faqs: {
        title: 'Frequently asked questions'
      }
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
  mainModule: any = {};
  moduleConfig: any = {};
  contentData: any = {};

  parentCat: any = {};
  sameCats: any = [];
  childCats: any = [];
  parentCatPosts: any = [];

  alias = {
    general: 'general',
    article: 'article',
    post: 'post'
  }
  dataSource: any = [];
  
  mainCover: string = 'assets/imgs/main_cover.jpg';
  webAvatar: any = {};
  pageTitle!: string;
  pageCaption!: string;
  general: any = {};
  data: any = {};
  posts: any = [];
  articles: any = [];
  FAQs: any = [];

  coverConfig: any = {};
  contentConfig: any = {};
  postStyles: any = {};
  childCatStyles: any = {};
  sameCatStyles: any = {};
  parentCatPostsStypes: any = {};

  imageSource: any = [];
  isBrowser: boolean;
  navIsFixed: boolean;
  routerLoading: boolean;
  routerLoaded: boolean;

  hostname: string;

  //Create component: npm run ng g c main/contents/page

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private setTagsService: SetTagsService,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService,
    private pageService: PageService,
    private layoutService: LayoutService,
    private filesService: FilesService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitDataSearchResult) {
        this.data.mess = message.data.mess;
        this.posts = message.data.posts;
      }

      if (message.text === messageService.messages.changeLanguage) {
        const newLang = message.data;
        if (this.moduleData.id) {
          this.renderModuleData(this.moduleData, newLang);
          let route = '/' + newLang;
          if (this.params.moduleRoute) {
            const moduleRoute = this.findModuleRoute(this.moduleData);
            if (moduleRoute) {
              route = route + '/' + moduleRoute;
              if (this.params.pageID && this.data.id) {
                const data = this.dataSource.find((item: any) => item.managerID === this.data.managerID && item.lang === newLang);
                if (data) {
                  const aliasData = this.moduleData.aliasData.find((item: any) => item.name === data.alias);
                  const getDataBy = aliasData?.pageConfig?.getData?.where;
                  const pageID = getDataBy==='path' ? data.path : data.id;
                  route = route + '/' + pageID;
                  if (getDataBy !== 'path') {
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
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.hostname = this.appService.hostname;

    this.params = this.route.snapshot.params;
    this.lang = this.route.snapshot.params.lang;
    this.appService.sitelang = this.lang;
    
    this.getLangData();

    this.routerLoading = true;

    this.moduleRoute = this.params.moduleRoute;
 
    if (this.appService.domainData) {
      this.getSiteData();
      this.getModuleData();
    } else {
      this.getDomainData();
    }

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.routerLoading = true;
        this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
        this.routerLoaded = false;

        const params = val.state.root.firstChild?.firstChild?.params;
        if (params) {
          this.posts = [];
          this.childCats = [];
          this.sameCats = [];
          this.parentCatPosts = [];

          const noChangeModuleRoute = params.moduleRoute && this.params.moduleRoute || !params.moduleRoute && !this.params.moduleRoute;
          const noChangePageID = params.pageID && this.params.pageID || !params.pageID && !this.params.pageID;
          const noChangePath = params.path && this.params.path || !params.path && !this.params.path;
          if (noChangeModuleRoute && noChangePageID && noChangePath) {
            this.params = params;
            if (params.moduleRoute === this.moduleRoute) {
              if (this.moduleData.id) {
                // console.log('getPageData');
                // this.getPageData();
                this.renderData();
                this.renderChildCats();
                this.renderSameCats();
                this.renderParentPosts();
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

    if (this.isBrowser) {
      const logErr = (err: any, message: string) => this.appService.logErr(err, message, 'PageComponent');

      this.socket = this.socketioService.on('on_connected').subscribe(data => {
        // console.log(data);
      }, err => logErr(err, 'Socket on_connected'));

      this.socket = this.socketioService.on('updateCatData').subscribe((data: any) => {
        console.log(data);
        
      }, err => logErr(err, 'Socket on updateCatData'));
    }
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.dateFormat = this.langData.dateFormat;
  }

  setGlobalStyles() {
    if (this.isBrowser) {
      const layoutSettings = this.appService.domainData.layoutSettings;
      // console.log(layoutSettings);

      const wrapper = document.getElementById('wrapper') as HTMLElement;

      const colors = layoutSettings?.colors;
      if (colors) {
        this.layoutService.globalColors = colors;
        const findColor = (type: string) => {
          return colors.find((item: any) => item.type === type);
        }
        
        let primary = findColor('primary');
        if (!primary) { primary = { hex: '#263238' } };
        const primaryColor = primary.rgba ? primary.rgba : primary.hex;
    
        let accent = findColor('accent');
        if (!accent) { accent = { hex: '#0288d1' } };
        const accentColor = accent.rgba ? accent.rgba : accent.hex;
    
        let warn = findColor('warn');
        if (!warn) { warn = { hex: '#c62828' } };
        const warnColor = warn.rgba ? warn.rgba : warn.hex;
    
        let white = findColor('white');
        if (!white) { white = { hex: '#e3f2fd' } };
        const whiteColor = white.rgba ? white.rgba : white.hex;
    
        let background = findColor('background');
        if (!background) { background = { hex: '#bbdefb' } };
        const backgroundColor = background.rgba ? background.rgba : background.hex;

        wrapper?.style.setProperty('--primaryColor', primaryColor);
        wrapper?.style.setProperty('--accentColor', accentColor);
        wrapper?.style.setProperty('--warnColor', warnColor);
        wrapper?.style.setProperty('--whiteColor', whiteColor);
        wrapper?.style.setProperty('--backgroundColor', backgroundColor);
      }

      let fontFamily = layoutSettings.fontFamily ? layoutSettings.fontFamily : 'Mitr';
      let fontSize = layoutSettings.fontSize ? layoutSettings.fontSize : '16 px';
      let fontWeight = layoutSettings.fontWeight ? layoutSettings.fontWeight : 300;
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
    const covers = this.appService.isArray(domainData?.layoutSettings?.covers).data;
    
    const mainCover = covers[0];
    if (mainCover) {
      mainCover.src = this.appService.getFileSrc(mainCover);
      this.mainCover = mainCover.src;
    }

    const webAvatar = this.appService.domainData?.layoutSettings?.webAvatar;
    if (webAvatar) {
      webAvatar.src = this.appService.getFileSrc(webAvatar);
      this.webAvatar = webAvatar;
      this.appService.webAvatar = this.webAvatar.src;
    }
    
    const language = getData(domainData.languages);
    if (language) { 
      this.siteValues = language;
      this.appService.siteName = this.siteValues.name;
    };
    
    if (this.siteValues.tels) {
      this.siteValues.tels.forEach((tel: any) => {
        tel.value = tel.code + tel.number;
        tel.viewValue = tel.code + ' ' + tel.number;
      });
    }

    if (this.siteValues.socials) {
      this.siteValues.socials.forEach((item: any) => {
        const socialData = this.appService.socialBtns.find((i: any) => i.alias === item.type);
        item.name = socialData?.alias;
        item.href = socialData?.href + item.value;
        item.faIcon = socialData?.faIcon;
        item.imgIcon = socialData?.imgIcon;
      });
    }

    const menu = getData(domainData.menu);

    const data = {
      domainData: domainData,
      siteValues: language,
      menu: menu?.data
    }
    this.messageService.sendMessage(this.messageService.messages.emitSiteData, data);
  }

  getDomainData() {
    this.appService.getDomainData().subscribe(res => {
      if (res.mess === 'ok') {
        this.appService.userAgent = res.userAgent;
        this.appService.domainData = res.data;
        this.appService.uploadPath = this.appService.uploadPath + res.data.id;
        this.setFavicons(this.appService.domainData);
        this.setGlobalStyles();
        this.getSiteData();
        this.getModuleData();
      } else {
        this.data = this.languageService.getLoadingErr(this.lang);
        this.dataLoaded();
        this.logErr(res.err, 'getDomainData()');
      }
    }, err => {
      this.data = this.languageService.getLoadingErr(this.lang);
      this.dataLoaded();
      this.logErr(err, 'getDomainData()');
    });
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
          this.data = this.languageService.getLoadingErr(this.lang);
          this.articles = [];
          this.dataLoaded();
          this.logErr(res.err, 'getModuleData()');
        }
      }, err => {
        this.data = this.languageService.getLoadingErr(this.lang);
        this.articles = [];
        this.dataLoaded();
        this.logErr(err, 'getModuleData()');
      });
    }
  }

  renderModuleData(e: any, lang: string) {
    e.nameValue = this.languageService.getLangValue(e.name, lang);
    e.aliasData = this.appService.isArray(e.aliasData).data;
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
    if (this.pageService.MODULES) {
      if (this.moduleRoute) {
        e = this.pageService.MODULES.find((item: any) => item.route === this.moduleRoute);
      } else {
        e = this.pageService.MODULES.find((item: any) => item.alias === 'home_page');
      }
    }

    if (e) {
      this.moduleData = e;
      const parentCat = this.pageService.MODULES.find((item: any) => item.id === this.moduleData.cat);
      if (parentCat) {
        this.parentCat = parentCat;
      }

      if (this.moduleData.level > 0) {
        const mainModule = this.pageService.MODULES.find((item: any) => item.alias === this.moduleData.moduleGroup);
        if (mainModule) { this.mainModule = mainModule };
      }

      this.moduleConfig = this.findMainModuleConfig();
      if (this.moduleConfig.contentData) { this.contentData = this.moduleConfig.contentData };
      // console.log('----this.moduleConfig');
      // console.log(this.moduleConfig);

      this.renderChildCats();
      this.renderSameCats();
      this.renderParentPosts();

      this.tables.manager = this.appService.getPostsTable(e, this.appService.tables.posts.manager);
      this.tables.posts = this.appService.getPostsTable(e, this.appService.tables.posts.list);
      this.getPageData();
    } else {
      this.moduleData = {};
      this.data = this.languageService.getPageNotFound(this.lang);
      this.articles = [];
      this.dataLoaded();
    }
  }

  getPageData() {
    const orderBy = this.moduleConfig?.contentData?.samePosts?.orderBy;
    const catData = {
      id: this.moduleData.id,
      alias: this.moduleData.alias,
      mainModuleAlias: this.mainModule?.alias,
      parrentCatAlias: this.parentCat?.alias,
      manager: this.tables.manager,
      posts: this.tables.posts,
      orderBy: orderBy
    };
    this.appService.getPageData(catData).subscribe(res => {
      if (res.mess === 'ok') {
        this.pageService.POSTS = res.posts;
        this.dataSource = res.posts;
        this.renderData();
      } else {
        this.data = this.languageService.getLoadingErr(this.lang);
        this.articles = [];
        this.dataLoaded();
        this.logErr(res.err, 'getPageData()');
      }
    }, err => {
      this.data = this.languageService.getLoadingErr(this.lang);
      this.articles = [];
      this.dataLoaded();
      this.logErr(err, 'getPageData()');
    });
  }

  renderPost(data: any) {
    this.layoutService.renderDataImages(data);
  }

  renderData() {
    const general = this.dataSource.find((item: any) => item.cat === this.moduleData.alias && item.alias === this.alias.general && item.lang === this.lang);
    if (general) {
      this.general = general;
      this.FAQs = general.faqs;
      if (this.moduleData.level > 1) {
        const parentCat = this.pageService.MODULES.find((item: any) => item.id === this.moduleData.cat);
        if (parentCat) {
          const parentCatData = this.dataSource.find((item: any) => item.cat === parentCat.alias && item.alias === this.alias.general && item.lang === this.lang);
          this.pageTitle = parentCatData?.name;
          this.pageCaption = parentCatData?.caption;
          if (parentCatData) {
            this.FAQs = parentCatData.faqs.concat(this.FAQs);
          }
        }
        if (!this.pageTitle) { this.pageTitle = general.name };
        if (!this.pageCaption) { this.pageCaption = general.caption };
      } else {
        this.pageTitle = general.name;
        this.pageCaption = general.caption;
      }

      if (this.params.pageID) {
        const aliasData = this.moduleData.aliasData.find((item: any) => item.name === this.alias.post);
        const getDataBy = aliasData?.pageConfig?.getData?.where;
        if (getDataBy==='path') {
          var post = this.dataSource.find((item: any) => item.path == this.params.pageID && item.lang === this.lang);
        } else {
          var post = this.dataSource.find((item: any) => item.id == this.params.pageID && item.lang === this.lang);
        }
        if (post) {
          this.renderPost(post);
          this.data = post;
          this.FAQs = this.FAQs.concat(post.faqs);
          this.getPageConfig();
          this.renderArticles();
          this.renderSamePosts();
        } else {
          this.data = this.languageService.getPageNotFound(this.lang);
          this.articles = [];
        }
      } else {
        this.renderPost(general);
        this.data = general;
        this.getPageConfig();
        this.renderArticles();
        this.renderSamePosts();
      }
    } else {
      this.data = this.languageService.getPageNotFound(this.lang);
      this.articles = [];
    }
    console.log('---data'); console.log(this.data);

    this.dataLoaded();
  }

  getPageConfig() {
    let alias = this.moduleData.aliasData.find((item: any) => item.name === this.data.alias);
    if (this.moduleData.level > 0) {
      alias = this.mainModule.aliasData.find((item: any) => item.name === this.data.alias);
      if (!alias) {
        alias = this.mainModule.aliasData.find((item: any) => item.name === 'general');
      }
    }
    const aliasConfig = alias?.pageConfig;

    let cover = aliasConfig?.layout?.cover;
    let content = aliasConfig?.layout?.content;
    // let postStyles = aliasConfig?.layout?.postStyles;
    
    // let childCatStyles = aliasConfig?.layout?.childCatStyles;
    // let sameCatStyles = aliasConfig?.layout?.sameCatStyles;
    if (alias?.config) {
      cover = this.data.config.cover;
      content = this.data.config.content;
      // postStyles = this.data.config.postStyles;
      // childCatStyles = this.data.config.childCatStyles;
      // sameCatStyles = this.data.config.sameCatStyles;
      if (!cover) { cover = aliasConfig?.layout?.cover };
      if (!content) { content = aliasConfig?.layout?.content };
      // if (!postStyles) { postStyles = aliasConfig?.layout?.postStyles };
      // if (!childCatStyles) { childCatStyles = aliasConfig?.layout?.childCatStyles };
      // if (!sameCatStyles) { sameCatStyles = aliasConfig?.layout?.sameCatStyles };
    }
    
    if (cover) { 
      this.layoutService.getCoverConfig(this.data, cover);
      
      this.coverConfig = cover;
      setTimeout(() => {
        this.coverConfig.loadingData = false;
      }, 1);
    };
    // console.log('---coverConfig');
    // console.log(this.coverConfig);

    this.getContentConfig(content);
    // this.postStyles = postStyles;
    // this.postStyles = this.getPostsStyles(true);
    
    // this.childCatStyles = childCatStyles;
    // this.sameCatStyles = sameCatStyles;
    
    if (this.isBrowser) {
      const pageLayout = document.getElementById("page-layout") as HTMLElement;
      setTimeout(() => {
        const coverheight = this.coverConfig.height ? (this.coverConfig.height + 'px') : 'auto';
        pageLayout?.style.setProperty('--coverheight', coverheight);
        const coverImageBlur = this.coverConfig.imageBlur ? this.coverConfig.imageBlur + 'px' : 'none';
        pageLayout?.style.setProperty('--coverImageBlur', coverImageBlur);
      }, 1);
    }
  }

  getContentConfig(content: any) {
    //Set content config by mainModule
    content = this.moduleConfig.content;

    if (!content) { content = {} };
    if (content.sidebar && content.sidebar !== 'none') {
      if(!content.cols) { content.cols = { xl: 3, lg: 4, md: 4, sm: 12, xs: 12 } };
      const sidebarXl = content.cols.xl;
      const sidebarLg = content.cols.lg;
      const sidebarMd = content.cols.md;
      const sidebarSm = content.cols.sm;
      const sidebarXs = content.cols.xs;
      content.sidebarCols = 'col-xl-' + sidebarXl + ' col-lg-' + sidebarLg + ' col-md-' + sidebarMd + ' col-sm-' + sidebarSm + ' col-' + sidebarXs;

      const contentXl = sidebarXl === 12 ? 12 : 12 - sidebarXl;
      const contentLg = sidebarLg === 12 ? 12 : 12 - sidebarLg;
      const contentMd = sidebarMd === 12 ? 12 : 12 - sidebarMd;
      const contentSm = sidebarSm === 12 ? 12 : 12 - sidebarSm;
      const contentXs = sidebarXs === 12 ? 12 : 12 - sidebarXs;
      content.contentCol = 'col-xl-' + contentXl + ' col-lg-' + contentLg + ' col-md-' + contentMd + ' col-sm-' + contentSm + ' col-' + contentXs;
    } else {
      content.sidebarCols = 'col-12';
      content.contentCol = 'col-12';
    }

    this.layoutService.getElementStyles(content);
    if (content.padding) {
      if (content.padding.value && content.padding.unit) {
        const paddingValue = content.padding.value + content.padding.unit;
        content.styles.padding = paddingValue + ' 0';
      }
    }

    const defaultAvatar = {
      position: 'left',
        width: { value: 50, unit: '%' },
        height: { value: 70, unit: '%' },
        background: { type: 'white' },
        styles: {
          padding: '7px',
          boxShadow: '0 2px 5px -3px'
      }
    }

    if (!content.avatar) { content.avatar = defaultAvatar };
    let avatar = content.avatar;
    if (!avatar.pictureStyles) { avatar.pictureStyles = {} };
    const avatarWidth = avatar.width?.value;
    if (avatarWidth) {
      avatar.pictureStyles.width = avatarWidth + avatar.width.unit;
    }
    if (!avatar.heightStyles) { avatar.heightStyles = {} };
    if (!avatar.height) { avatar.height = { value: 70, unit: '%' } };
    const avatarHeight = avatar.height.value;
    avatar.heightStyles.paddingTop = avatarHeight + avatar.height.unit;

    avatar.styles = this.appService.isObject(avatar.styles).data;
    if (avatar.background) {
      this.layoutService.findColor(avatar.background);
      avatar.styles.backgroundColor = avatar.background.rgba;
    }

    this.contentConfig = content;
    // console.log('--contentConfig');
    // console.log(this.contentConfig);
  }

  renderArticles() {
    let articles: any = this.dataSource.filter((item: any) => item.alias === this.alias.article);
    articles = this.appService.sortArray(articles);
    articles.forEach((e: any) => {
      if(!e.config.cover) { e.config.cover = {} };
      this.layoutService.getCoverConfig(e, e.config.cover);
    });
    this.articles = articles;
    this.articles.forEach((e) => {
      this.renderPost(e);
      e.elementID = e.cat + '_' + e.id;
    });
  }

  renderSamePosts() {
    const mainModuleConfig = this.findMainModuleConfig();
    const onSidebar = mainModuleConfig.childModulesDependence === true;
    const postStyles = this.getPostsStyles(onSidebar);
    if (postStyles) { 
      postStyles.position = onSidebar ? 'onSidebar' : 'afterContent';
      this.postStyles = postStyles;
    }
    // console.log('this.postStyles');
    // console.log(this.postStyles);
    
    const postsList = this.dataSource.filter((item: any) => item.alias === this.alias.post && item.lang === this.data.lang && item.enabled);
    postsList.forEach((e: any) => {
      this.renderPost(e);
      e.prodItemID = this.moduleData.table_name + e.id;

      let route = '/' + e.lang + '/' + this.moduleData.route;
      const aliasData = this.moduleData.aliasData.find((item: any) => item.name === e.alias);
      const getDataBy = aliasData?.pageConfig?.getData?.where;
      const pageID = getDataBy==='path' ? e.path : e.id;
      route = route + '/' + pageID;
      if (getDataBy !== 'path') {
        const path = e.path ? e.path : this.appService.getLink(e.name);
        route = route + '/' + path;
      }
      e.route = route;
    });
    this.posts = postsList;
    // console.log('--Posts');
    // console.log(this.posts);

    // const newsApi = 'https://fcsapi.com/api-v3/news/news?access_key=';
    // const access_key = 'q4MATKZyRgW9duVgSm87XqsSk';
    // const find = 'EUR/USD';
    // const url = newsApi + access_key + '&find=' + find;
    // this.appService.getAnyApi(url).subscribe(res => {
    //   console.log(res);
    // }, err => this.logErr(err, 'Get news api'));
  }

  renderChildCats() {
    const childCats = this.pageService.MODULES.filter((item: any) => item.cat === this.moduleData.id);
    this.childCats = childCats;

    const childCatStyles: any = {};

    const mainModuleConfig = this.findMainModuleConfig();
    if (this.moduleData.level === 0) {
      childCatStyles.position = 'afterContent';
      childCatStyles.type = 'product';
      let postStyles = this.getPostsStyles(false);
      if (!postStyles) { postStyles = {} };
      childCatStyles.postStyles = postStyles;
    } else {
      const childModulesDependence = mainModuleConfig.childModulesDependence;
      const onSidebar = childModulesDependence && this.moduleData.level === 1;
      childCatStyles.position = onSidebar ? 'onSidebar' : 'afterContent';
      childCatStyles.type = onSidebar ? 'menu' : 'product';

      let postStyles = this.getPostsStyles(onSidebar);
      if (!postStyles) { postStyles = {} };
      childCatStyles.postStyles = postStyles;
    }
    
    this.childCatStyles = childCatStyles;
  }

  renderSameCats() {
    if (this.moduleData.cat !== 0) {
      const mainModuleConfig = this.findMainModuleConfig();

      const sameCatStyles: any = {};
      const onSidebar = mainModuleConfig.childModulesDependence && this.moduleData.level > 1;
      sameCatStyles.position = onSidebar ? 'onSidebar' : 'afterContent';
      sameCatStyles.type = onSidebar ? 'menu' : 'product';

      let postStyles = this.getPostsStyles(onSidebar);
      if (!postStyles) { postStyles = {} };
      sameCatStyles.postStyles = postStyles;
      this.sameCatStyles = sameCatStyles;


      if (this.moduleData.level === 1) {
        this.sameCats = this.pageService.MODULES.filter((item: any) => item.cat === this.moduleData.cat && item.id !== this.moduleData.id);
      } else {
        if (mainModuleConfig.childModulesDependence) {
          this.sameCats = this.pageService.MODULES.filter((item: any) => item.cat === this.moduleData.cat);
        } else {
          this.sameCats = this.pageService.MODULES.filter((item: any) => item.cat === this.moduleData.cat && item.id !== this.moduleData.id);
        }
      }
    }
  }

  renderParentPosts() {
    const mainModuleConfig = this.findMainModuleConfig();
    if (this.moduleData.level > 1 && mainModuleConfig.childModulesDependence) {
      this.parentCatPosts = [ this.parentCat ];
      
      const parentCatPostsStypes: any = {};
      const onSidebar = true;
      parentCatPostsStypes.position = onSidebar ? 'onSidebar' : 'afterContent';
      parentCatPostsStypes.type = onSidebar ? 'menu' : 'product';
      parentCatPostsStypes.postStyles = this.getPostsStyles(onSidebar);
      this.parentCatPostsStypes = parentCatPostsStypes;
    }
  }

  findMainModuleConfig() {
    let module = this.moduleData;
    if (this.moduleData.level > 0) {
      module = this.pageService.MODULES.find((item: any) => item.alias === this.moduleData.moduleGroup);
    }
    const config = this.appService.isObject(module?.moduleConfig).data;
    const contentData = this.appService.isObject(module?.contentData).data;

    if (!contentData.samePosts) { contentData.samePosts = {} };
    if (!contentData.sameCats) { contentData.sameCats = {} };
    if (!contentData.childCats) { contentData.childCats = {} };
    contentData.samePostsTitle = this.languageService.getLangValue(contentData.samePosts.data, this.lang);
    contentData.sameCatsTitle = this.languageService.getLangValue(contentData.sameCats.data, this.lang);
    contentData.childCatsTitle = this.languageService.getLangValue(contentData.childCats.data, this.lang);
    this.layoutService.getElementStyles(contentData.samePosts);
    this.layoutService.getElementStyles(contentData.sameCats);
    this.layoutService.getElementStyles(contentData.childCats);

    config.contentData = contentData;
    return config;
  }

  getPostsStyles(onSidebar: boolean) {
    const moduleConfig = this.findMainModuleConfig();
    const postStyles = onSidebar ? moduleConfig.postStylesOnSisebar : moduleConfig.postStylesAfterContent;
    return postStyles;
  }

  dataLoaded() {
    this.updateTags();

    setTimeout(() => {
      this.routerLoading = false;
      this.routerLoaded = true;
      this.messageService.sendMessage(this.messageService.messages.layoutLoaded, true);
      this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
    }, 300);
  }

  setFavicons(domainData: any) {
    // console.log(domainData);
    let favicons: any = []; //Get favicons from domainData.layoutSettings
    favicons = [
      {
        rel: 'icon',
        type: 'image/x-icon',
        sizes: null,
        href: 'favicon.ico'
      },
      {
        rel: 'apple-touch-icon',
        type: null,
        sizes: '180x180',
        href: 'assets/favicon_io/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: 'assets/favicon_io/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: 'assets/favicon_io/favicon-16x16.png'
      },
      {
        rel: 'manifest',
        type: null,
        sizes: null,
        href: 'assets/favicon_io/site.webmanifest'
      }
    ]
    // favicons.forEach((item: any) => {
    //   const data = {
    //     rel: item.rel,
    //     type: item.type,
    //     sizes: item.sizes,
    //     href: item.href
    //   }
    //   this.setTagsService.setFavicon(data);
    // });
  
  
    if (domainData?.layoutSettings?.favicons) {
      domainData.layoutSettings.favicons.forEach((img: any) => {
        img.src = this.appService.getFileSrc(img);
      });
      const favicon = domainData.layoutSettings.favicons[0];
      if (favicon) {
        const data = {
          rel: 'icon',
          type: 'image/x-icon',
          href: favicon.src
        }
        this.setTagsService.setFavicon(data);
      }
    }
  }

  updateTags() {
    let seoTags = this.siteValues.seoTags;
    if (!seoTags) { seoTags = {}; }
    
    if (this.moduleData.alias === 'home_page') {
      var title = seoTags.title;
    } else {
      var title = this.data.title ? this.data.title : this.data.name;
    }
    if (this.siteValues.name) { title = this.siteValues.name + ' | ' + title };

    var description = this.data.description;
    if (!description) { description = seoTags.description };

    const avatar = this.data.avatarImages?.find((item: any) => item.isImage);
    let logo = this.appService.domainData?.layoutSettings?.webAvatar;
    if (!logo && this.appService.domainData?.layoutSettings?.logos) {
      logo = this.appService.domainData.layoutSettings.logos[0];
    }
    if (logo) {
      logo.src = this.appService.getFileSrc(logo);
    }
    const image = avatar ? avatar.src : (logo ? logo.src : 'https://' + this.appService.domain + '/' + this.appService.webAvatar);

    const data = {
      title: title,
      description: description,
      dcTitle: title,
      image: image,
      type: null
    }
    this.setTagsService.updateTags(data);
  }

  logErr(err: any, functionName: string) {
    this.appService.logErr(err, functionName, 'PageComponent');
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
    if (this.socket) { this.socket.unsubscribe() };
    if (this.myObserve) { this.myObserve.unsubscribe() };
  }

}
