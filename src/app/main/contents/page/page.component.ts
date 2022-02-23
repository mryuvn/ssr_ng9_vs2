import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
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
  
  MODULES: any = [];
  parentCats: any = {};
  sameCats: any = [];
  childCats: any = [];

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
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitDataSearchResult) {
        this.data.mess = message.data.mess;
        this.articles = message.data.articles;
      }
    });
  }

  ngOnInit(): void {
    this.params = this.route.snapshot.params;
    this.lang = this.route.snapshot.params.lang;
    this.getLangData();

    this.routerLoading = true;
    this.getPageData();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.routerLoading = true;
        this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
        this.routerLoaded = false;


        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
        }

        const params = val.state.root.firstChild?.firstChild?.params;
        console.log(params);
        if (params) {
          this.params = params;
          
        }


        setTimeout(() => {
          this.routerLoading = false;
          this.routerLoaded = true;
          this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
        }, 300);
      }
    });
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.dateFormat = this.langData.dateFormat;
  }

  getDomainData() {
    this.appService.getDomainData().subscribe(res => {
      if (res.mess === 'ok') {
        console.log(res);
      } else {
        console.log({ res: res, time: new Date(), note: 'Err on getDomainData() of page.component.ts' });
      }
    }, err => {
      console.log({ err: err, time: new Date(), note: 'Err on getDomainData() of page.component.ts' });
    });
  }

  getPageData() {
    this.data = {
      title: 'Welcome to our website!',
      description: 'Web chuẩn SEO với Angular Universal, thiết kế bởi Mr.Yu VN'
    }

    this.updateTags();

    setTimeout(() => {
      this.routerLoading = false;
      this.routerLoaded = true;
      this.messageService.sendMessage(this.messageService.messages.layoutLoaded, null);
      this.messageService.sendMessage(this.messageService.messages.routerLoading, this.routerLoading);
    }, 300);
  }
  

  updateTags() {
    let title = this.data.title ? this.data.title : this.data.name ;
    const siteName = this.siteValues.name ? this.siteValues.name : this.appService.siteName;
    title = siteName + ' | ' + title;

    var description = this.data.description;
    if (!description) { description = this.siteValues.description };

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
