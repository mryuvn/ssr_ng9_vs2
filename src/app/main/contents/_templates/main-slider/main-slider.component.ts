import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainSliderComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  socket: any;
  myObserve: any;

  @Input() pageID: number;
  @Input() coverUrl: string;
  @Input() title: string;
  @Input() caption: string;
  @Input() slideConfig: any;

  lang: string;
  slideData: any = {};
  resetSlider: Boolean;

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      //
    });
  }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.getSlides();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        var lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getSlides();
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;

      this.socket = this.socketioService.on(this.socketioService.messages.library.newItem + '_' + this.appService.domain).subscribe(content => {
        const e = content.newData;
        if (e.alias === this.slideConfig.alias && e.lang === this.lang) {
          e.src = this.appService.getFileSrc(e.file_name, this.appService.uploadPaths.libraries);
          e.title = e.name;
          e.desData = this.appService.isJSON(e.destination);
          if (!this.slideData.dataSource) {
            this.slideData.dataSource = [];
          }
          this.slideData.dataSource.push(e);
          this.resetSlider = true;
          setTimeout(() => {
            this.resetSlider = false;
          }, 500);
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = this.socketioService.on(this.socketioService.messages.library.editItem + '_' + this.appService.domain).subscribe(content => {
        if (content.lang === this.lang) {
          const rs = content.aliasArr.find(item => item === this.slideConfig.alias);
          if (rs) {
            this.resetSlider = true;
            this.getSlides();
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = this.socketioService.on(this.socketioService.messages.library.deleteItem + '_' + this.appService.domain).subscribe(content => {
        if (content.lang === this.lang) {
          const rs = content.aliasArr.find(item => item === this.slideConfig.alias);
          if (rs) {
            this.resetSlider = true;
            this.getSlides();
          }
        }
      }), err => console.log({ err: err, time: new Date() });
    }
  }

  getSlides() {
    if (this.slideConfig) {
      if (this.slideConfig.alias) {
        this.appService.getSqlData({
          table: this.appService.tables.library.items,
          where: 'WHERE alias = "' + this.slideConfig.alias + '" AND enabled = 1 AND lang = "' + this.lang + '"',
          orderBy: 'ORDER BY sortNum ASC'
        }).subscribe(res => {
          if (res.mess === 'ok') {
            if (res.data.length > 0) {
              this.slideData.err = false;
              const dataSource = [];
              res.data.forEach(e => {
                e.src = this.appService.getFileSrc(e.file_name, this.appService.uploadPaths.libraries);
                e.title = e.name;
                e.desData = this.appService.isObject(e.destination);
                dataSource.push(e);
              });
              this.slideData.dataSource = dataSource;
            } else {
              this.slideData.dataSource = null;
              this.slideData.err = 'No data';
            }
            setTimeout(() => {
              this.resetSlider = false;
            }, 500);
          } else {
            console.log({ res: res, time: new Date() });
            this.slideData.err = res.err;
          }
        }, err => {
          console.log({ err: err, time: new Date() });
          this.slideData.err = err;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.socket) {
      this.socket.unsubscribe();
    }
    if (this.myObserve) {
      this.myObserve.unsubscribe();
    }
  }

}
