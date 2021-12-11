import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-content-quote',
  templateUrl: './content-quote.component.html',
  styleUrls: ['./content-quote.component.scss']
})
export class ContentQuoteComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  socket: any;
  myObserve: any;

  lang: string;
  pageAlias: string = 'content_quote';
  data: any = {};
  pageID: number;
  contents: any = [];

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

    if (isPlatformBrowser(this.platformId)) {
      this.socket = socketioService.on(socketioService.messages.userActions.checkConnecting).subscribe(data => {
        if (this.data.err) {
          this.getData();
        } else {
          if (this.data.getContentsErr) {
            this.getContents();
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      const pageMessages = {
        new: socketioService.messages.simplePage.new + '_' + appService.domain,
        edit: socketioService.messages.simplePage.edit  + '_' + appService.domain,
        delete: socketioService.messages.simplePage.delete + '_' + appService.domain,
        updateContents: socketioService.messages.simplePage.updateContents + '_' + appService.domain
      }
      this.socket = socketioService.on(pageMessages.new).subscribe(content => {
        const e = content.newData;
        if (e.alias === this.pageAlias && !this.pageID) {
          this.renderData(e);
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(pageMessages.edit).subscribe(content => {
        var arr = content.dataArr;
        if (!arr) {
          arr = [ content.data ];
        }
        var e = arr.find(item => item.id === this.pageID);
        if (e) {
          if (e.enabled) {
            this.renderData(e);
          } else {
            this.data = {};
            this.data.err = 'No data';
            this.pageID = null;
          }
        } else {
          e = arr.find(item => item.alias === this.pageAlias);
          if (!this.pageID && e.enabled) {
            this.renderData(e);
          }
        }
      }, err => console.log({ err: err, time: new Date() }));
      
      this.socket = socketioService.on(pageMessages.delete).subscribe(content => {
        const rs = content.dataArr.find(item => item.id === this.pageID);
        if (rs) {
          this.data = {};
          this.data.err = 'No data';
          this.pageID = null;
        }
      }, err => console.log({ err: err, time: new Date() }));
    
      this.socket = socketioService.on(pageMessages.updateContents).subscribe(content => {
        if (content.postID === this.pageID) {
          this.getContents();
        }
      });
    }
  }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.getData();
  }

  getData() {
    this.appService.getSqlData({
      table: this.appService.tables.simplePages.list,
      where: 'WHERE alias = "' + this.pageAlias + '" AND lang = "' + this.lang + '" AND enabled = 1'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        if (res.data.length > 0) {
          const e = res.data[0];
          this.renderData(e);
          this.getContents();
        } else {
          this.data.err = 'No data';
          console.log('No data with alias = "' + this.pageAlias + '"');
        }
      } else {
        this.data.err = res.err,
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.data.err = err;
      console.log({ err: err, time: new Date() });
    });
  }

  renderData(e) {
    e.config = this.appService.isObject(e.jsonData);
    this.data = e;
    this.pageID = e.id;
  }

  getContents() {
    this.appService.getSqlData({
      table: this.appService.tables.simplePages.contents,
      where: 'WHERE postID = "' + this.pageID + '" AND enabled = 1'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        res.data.forEach(e => {
          e.JSON = this.appService.isObject(e.jsonData);
        });
        this.contents = res.data;
        this.data.getContentsErr = null;
      } else {
        this.data.getContentsErr = res.err;
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.data.getContentsErr = err;
      console.log({ err: err, time: new Date() });
    });
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
