import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { SetTagsService } from 'src/app/services/set-tags.service';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  socket: any;
  myObserve: any;

  lang: string;
  siteValues: any = {};
  appName: string;

  isBrowser: boolean;
  showLazy: Boolean;
  navIsFixed: boolean;

  tables = {
    posts: '',
    contents: ''
  }
  uploadPath: string;

  cat: string = 'home_page';
  alias = {
    general: 'general',
    article: 'article'
  }
  data: any = {};

  articles: any = [];
  articlesID = {
    about: 'about',
    tradeEverywhere: 'tradeEverywhere',
    forexMarket: 'forexMarket',
    whyForex: 'whyForex',
    starting: 'starting',
    tradeWithUs: 'tradeWithUs'
  }
  about: any;
  tradeEverywhere: any;
  forexMarket: any;
  whyForex: any;
  starting: any;
  tradeWithUs: any;

  routerLoaded: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private setTagsService: SetTagsService,
    private appService: AppService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      //
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;

      this.socket = this.socketioService.on(this.socketioService.messages.userActions.checkConnecting).subscribe(data => {
        // this.getSiteValues();
        // this.getData();
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = this.socketioService.on(this.socketioService.messages.domains.edit).subscribe(content => {
        if (content.data.id === this.appService.domainID) {
          this.getSiteValues();
        }
      }, err => console.log(err));

      const messages = {
        newPost: socketioService.messages.posts.newPostList + '_' + appService.domain,
        editPost: socketioService.messages.posts.editPostList + '_' + appService.domain,
        deletePost: socketioService.messages.posts.deletePostList + '_' + appService.domain,
        updateContents: socketioService.messages.posts.updateContents + '_' + appService.domain
      }
      this.socket = socketioService.on(messages.newPost).subscribe(content => {
        const e = content.newData;
        if (!this.data.id && e.cat === this.cat && e.alias === this.alias.general && e.lang === this.lang && e.enabled) {
          this.renderData(e);
          // this.getContents(e.id);
        }
      }, err => console.log(err));

      this.socket = socketioService.on(messages.editPost).subscribe(content => {
        var arr = content.dataArr;
        if (!arr) {
          arr = [content.data];
        }
        const e = arr.find(item => item.id === this.data.id && item.cat === this.cat);
        if (e) {
          this.renderData(e);
        }
      }, err => console.log(err));

      this.socket = socketioService.on(messages.deletePost).subscribe(content => {
        if (this.data.id) {
          var arr = content.dataArr;
          const index = arr.findIndex(item => item.id === this.data.id && item.cat === this.cat);
          if (index !== -1) {
            this.data = {};
          }
        }
      }, err => console.log(err));

      this.socket = socketioService.on(messages.updateContents).subscribe(content => {
        if (content.table === this.tables.contents && content.postID === this.data.id) {
          this.renderContents(content.dataArr);
        }
      }, err => console.log(err));
    }
  }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.tables.posts = this.appService.tables.posts.list;
    this.tables.contents = this.appService.tables.posts.contents;
    this.uploadPath = 'posts';

    this.appName = this.appService.appName;
    this.siteValues = this.appService.siteValues.find(item => item.lang === this.lang);
    if (this.siteValues) {
      this.updateTags();
      this.appName = this.siteValues.name;
    } else {
      this.getSiteValues();
    }

    this.getData();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params.lang;
        this.getData();
      }
    });
  }

  getSiteValues() {
    this.appService.getSiteValues().then(res => {
      if (res.data) {
        this.siteValues = res.data.find(item => item.lang === this.lang);
        if (this.siteValues) {
          this.updateTags();
          this.appName = this.siteValues.name;
          setTimeout(() => {
            this.emitRouterLoaded();
            setTimeout(() => {
              this.showLazy = true;
            }, 1000);
          }, 500);
        }
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  getData() {
    this.appService.getSqlData({
      table: this.tables.posts,
      where: 'WHERE cat = "' + this.cat + '" AND lang = "' + this.lang + '"'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        var articles = [];
        res.data.forEach(e => {
          this.renderData(e);
          if (e.alias === this.alias.article) {
            articles.push(e);
          }
        });
        
        const data = res.data.find(item => item.alias === this.alias.general && item.enabled);
        if (data) {
          this.data = data;
        }
        
        if (articles.length > 0) {
          articles = this.appService.sortArray(articles, { field: 'sortNum' });
          this.getContents(articles);
        }
      } else {
        this.data.err = res.err;
      }
    }, err => {
      this.data.err = err;
    });

    setTimeout(() => {
      this.emitRouterLoaded();
      setTimeout(() => {
        this.showLazy = true;
      }, 1000);
    }, 500);
  }

  renderData(e) {
    if (e.avatar) {
      e.avatarUrl = this.appService.getFileSrc(e.avatar, this.uploadPath);
    }
    if (e.cover) {
      e.coverUrl = this.appService.getFileSrc(e.cover, this.uploadPath);
    }

    e.JSON = this.appService.isObject(e.jsonData);
    if (e.JSON.continueBtn) {
      e.continueBtn = e.JSON.continueBtn;
    }
  }

  getContents(articles) {
    let where = 'WHERE postID = "' + articles[0].id + '"';
    const arr = [];
    articles.forEach((e, index) => {
      e.contents = [];
      if (index > 0) {
        arr.push(' OR postID = "' + e.id + '"');
      }
    });
    const idStr = arr.join('');
    where = where + idStr;
    this.appService.getSqlData({
      table: this.tables.contents,
      where: where
    }).subscribe(res => {
      if (res.mess === 'ok') {
        res.data.forEach(e => {
          this.renderContents(e);
        });
        articles.forEach(ar => {
          ar.contents = res.data.filter(item => item.postID === ar.id);
        });
      } else {
        this.data.getContentsErr = res.err;
      }
      this.articles = articles;
      this.exportArticles();
    }, err => {
      this.data.getContentsErr = err;
      this.articles = articles;
      this.exportArticles();
    });
  }
  renderContents(e) {
    e.JSON = this.appService.isObject(e.jsonData);
  }

  exportArticles() {
    this.about = this.articles.find(item => item.JSON.articleID === this.articlesID.about);
    this.tradeEverywhere = this.articles.find(item => item.JSON.articleID === this.articlesID.tradeEverywhere);
    this.forexMarket = this.articles.find(item => item.JSON.articleID === this.articlesID.forexMarket);
    this.whyForex = this.articles.find(item => item.JSON.articleID === this.articlesID.whyForex);
    this.starting = this.articles.find(item => item.JSON.articleID === this.articlesID.starting);
    this.tradeWithUs = this.articles.find(item => item.JSON.articleID === this.articlesID.tradeWithUs);
  }

  emitRouterLoaded() {
    setTimeout(() => {
      this.messageService.sendMessage(this.messageService.messages.routerLoaded, true);
      setTimeout(() => {
        this.routerLoaded = true;
      }, 500);
    }, 1);
  }

  updateTags() {
    var image = 'https://' + this.appService.domain + '/' + this.appService.webAvatar;

    const data = {
      title: this.siteValues.title,
      description: this.siteValues.description,
      keywords: this.siteValues.keywords,
      dcTitle: this.siteValues.title,
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
