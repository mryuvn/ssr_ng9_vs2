import { Component, Inject, PLATFORM_ID, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-visitor-data',
  templateUrl: './visitor-data.component.html',
  styleUrls: ['./visitor-data.component.scss']
})
export class VisitorDataComponent implements OnInit {

  subscription: Subscription;

  @Output() emitData = new EventEmitter();

  lang: string;
  userInfo: any = {};

  domain: string;
  path: string;

  data = {
    visitors: 0,
    visitings: 0
  };

  visitorID: number;
  visitorData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private socketioService: SocketioService,
    private messageService: MessageService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      socketioService.on(socketioService.messages.userActions.checkConnecting).subscribe(data => {
        if (typeof (Storage) !== "undefined") {
          var clientUser = localStorage.getItem('clientUser');
          if (!clientUser) {
            clientUser = data.defaultUser;
            localStorage.setItem('clientUser', clientUser);
          }

          if (localStorage.getItem('isLoged')) {
            var isLoged = appService.isObject(localStorage.getItem('isLoged'));
            var username = isLoged.username;
          }
        }
        this.userInfo.socketId = data.socketId;
        this.userInfo.clientUser = clientUser;

        if (isLoged) {
          this.userInfo.username = isLoged.username;
          this.userInfo.status = isLoged.status;
        }
        this.getClientData();
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.visitor.receiveVisitorData).subscribe(VISITORDATA => {
        this.getVisitings(VISITORDATA);
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.visitor.newVisitor + '_' + this.appService.domain).subscribe(content => {
        this.getVisitors();
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.path = val.url;
        if (this.visitorData) {
          this.changeUrl();
        }
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
        }
      }
    });

    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.text === this.messageService.messages.sendUserData) {
        if (this.userInfo.socketId && !this.userInfo.userData) {
          this.userInfo.userData = message.data;
          const data = {
            username: message.data.username,
            userData: message.data
          }
          this.socketioService.emit(this.socketioService.messages.visitor.updateData, data);
        }
      }

      if (message.text === this.messageService.messages.removeUserData) {
        if (this.userInfo.socketId) {
          this.userInfo.userData = null;
          const data = {
            username: this.userInfo.username,
            userData: null
          }
          this.socketioService.emit(this.socketioService.messages.visitor.updateData, data);
        }
      }
    });
  }

  getClientData() {
    const apiUrl = 'https://api.vfl-admin.com/plugins/get-client-data';
    this.appService.getApiData(apiUrl).subscribe(res => {
      this.domain = res.domain;
      if (res.domain) {
        var domain = res.domain.split("://").pop();
      }

      this.userInfo.domain = domain;
      this.userInfo.url = res.url;
      this.userInfo.ip = res.ip;
      this.userInfo.geoData = res.ipData;
      this.userInfo.userAgent = res.userAgent;

      if (!this.userInfo.userData && this.appService.userData.username) {
        this.userInfo.userData = this.appService.userData;
      }
      this.socketioService.emit(this.socketioService.messages.visitor.visitorInfo, this.userInfo);

      const localhost = res.domain.indexOf('localhost');
      if (localhost == -1 && !this.visitorID) {
        this.addVisitorData();
      } else {
        this.getVisitors();
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  addVisitorData() {
    const accessLinks = [];
    const link = {
      url: this.userInfo.url,
      time: new Date()
    }
    accessLinks.push(link);
    const dataPost = {
      table: this.appService.tables.visitors,
      fields: {
        clientUser: this.userInfo.clientUser,
        ip: this.userInfo.ip,
        geoData: JSON.stringify(this.userInfo.geoData),
        userAgent: JSON.stringify(this.userInfo.userAgent),
        baseUrl: this.userInfo.domain,
        accessLinks: JSON.stringify(accessLinks),
        createdTime: new Date()
      }
    }
    this.appService.addSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        this.visitorID = res.newId;
        this.socketioService.emit(this.socketioService.messages.visitor.updateVisitorId, this.visitorID);

        const dataEmit = {
          message: this.socketioService.messages.visitor.newVisitor + '_' + this.appService.domain,
          emit: true,
          broadcast: true,
          content: null
        }
        this.socketioService.emit('client_emit', dataEmit);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  getVisitings(VISITORDATA) {
    var thisDomain = this.userInfo.domain;

    const visitings = [];
    VISITORDATA.forEach(e => {
      if (e.domain === thisDomain) {
        const rs = visitings.find(item => item.clientUser === e.clientUser);
        if (!rs) {
          visitings.push(e);
        }
      }
    });

    this.data.visitings = visitings.length;
    this.emitData.emit(this.data);
  }

  getVisitors() {
    this.appService.getSqlData({
      table: this.appService.tables.visitors
    }).subscribe(res => {
      if (res.mess === 'ok') {
        const visitors = [];
        res.data.forEach(e => {
          if (e.baseUrl === this.userInfo.domain) {
            visitors.push(e);
          }
        });
        this.data.visitors = visitors.length;
        this.emitData.emit(this.data);
        this.visitorData = res.data.find(item => item.id === this.visitorID);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  changeUrl() {
    const url = this.domain + this.path;
    const accessLinks = this.appService.isArray(this.visitorData.accessLinks).data;
    const item = {
      url: url,
      time: new Date()
    }
    accessLinks.push(item);
    this.visitorData.accessLinks = accessLinks;

    const dataPost = {
      table: this.appService.tables.visitors,
      set: 'accessLinks = ?',
      where: 'id',
      params: [
        JSON.stringify(accessLinks), this.visitorID
      ]
    }
    this.appService.editSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        this.socketioService.emit(this.socketioService.messages.visitor.changeViewUrl, url);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

}
