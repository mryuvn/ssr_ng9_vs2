import { Component, Inject, PLATFORM_ID, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrls: ['./cats-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatsListComponent implements OnInit,OnDestroy {
  
  subscription: Subscription;
  socket: any;

  @Input() dataSource: any;
  @Input() lang: string;
  @Input() config: any;
  @Input() title: string;
  @Input() db_table: string;
  @Input() uploadPath: string;
  @Input() dateFormat: string;
  @Input() moduleID: number;

  langsData: any = [
    {
      lang: 'vi',
      free: 'Miễn phí'
    },
    {
      lang: 'en',
      free: 'Free'
    }
  ];
  langContent: any = {};

  carousel: any = [];

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.updateCats) {
        setTimeout(() => {
          // console.log(this.dataSource);
        }, 1000);
      }
    });

    const messages = {
      newPost: socketioService.messages.posts.newPostList + '_' + appService.domain,
      editPost: socketioService.messages.posts.editPostList + '_' + appService.domain,
      deletePost: socketioService.messages.posts.deletePostList + '_' + appService.domain
    }

    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.socket = this.socketioService.on(messages.newPost).subscribe(content => {
        if (this.config.type === 'articles' && this.dataSource.length > 0) {  
          const data = content.data;
          if (data.alias === 'general' && data.lang === this.lang) {
            this.dataSource.forEach(e => {
              if (data.cat === e.alias) {
                this.renderDataSource(e, data);
              }
            });
          }
        }
      }, err => console.log({ err: err, time: new Date() }));
      
      this.socket = this.socketioService.on(messages.editPost).subscribe(content => {
        if (this.config.type === 'articles' && this.dataSource.length > 0) {
          let arr = content.dataArr;
          if (!arr) {
            arr = [ content.data ];
          }
          this.dataSource.forEach(e => {
            const data = arr.find(item => item.cat === e.alias && item.alias === 'general' && item.lang === this.lang);
            if (data) {
              this.renderDataSource(e, data);
            }
          });
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = this.socketioService.on(messages.deletePost).subscribe(content => {
        if (this.config.type === 'articles' && this.dataSource.length > 0) {
          let arr = content.dataArr;
          if (!arr) {
            arr = [ content.data ];
          }
          const deleted = [];
          this.dataSource.forEach(e => {
            const data = arr.find(item => item.id === e.dataID);
            if (data) {
              deleted.push(data);
            }
          });
          if (deleted.length > 0) {
            this.getGeneralData();
          }
        }
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  ngOnInit(): void {
    this.getLangData();
    if (this.config.type === 'articles' && this.dataSource.length > 0) {
      this.getGeneralData();
    }
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  getGeneralData() {
    this.appService.getSqlData({
      table: this.db_table,
      where: 'WHERE alias = "general" AND lang = "' + this.lang + '"' 
    }).subscribe(res => {
      if (res.mess === 'ok') {
        // console.log(res.data);
        this.exportData(res.data);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  renderDataSource(e, data) {
    this.appService.renderPageData(data, this.uploadPath);
    e.avatar = data.avatar;
    e.avatarUrl = data.avatarUrl;
    e.avatarType = data.avatarType;
    e.dataID = data.id;
    e.details = data.JSON;
  }

  exportData(DATA) {
    const carousel = [];
    let items = [];
    if (this.config.hideCurrentCat) {
      const index = this.dataSource.findIndex(item => item.id === this.moduleID);
      if (index !== -1) {
        this.dataSource.splice(index, 1);
      }
    }
    
    const dataLength = this.dataSource.length;
    this.dataSource.forEach((e, index) => {
      const data = DATA.find(item => item.cat === e.alias);
      if (data) {
        this.renderDataSource(e, data);
      }

      if (this.config.viewMod === 'carousel' && e.id !== this.moduleID) {
        items.push(e);
        if (items.length === this.config.perPage) {
          carousel.push(items);
          items = [];
        }
        if (index === (dataLength - 1) && items.length > 0) {
          const missing = this.config.perPage - items.length;
          if (missing > 0) {
            const missingItems = this.dataSource.slice(0, missing);
            items = items.concat(missingItems);
          }
          carousel.push(items);
          items = [];
        }
      }
    });
    // console.log(this.dataSource);
    // console.log(carousel);
    this.carousel = carousel;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
