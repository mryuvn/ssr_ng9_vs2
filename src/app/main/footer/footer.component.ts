import { Component, Inject, PLATFORM_ID, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { AppService } from 'src/app/services/app.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MessageService } from 'src/app/services/message.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {

  @Input() siteValues: any;
  @Input() visitorData: any;

  lang: string;
  path: string;

  langData: any = {};

  menuType: string = 'footer';
  menuData: any = [];
  getMenuErr: any;

  EMBED_CODES: any = [];
  embedCodes: any;

  socials: any = [
    {
      name: 'Youtube',
      icon: {
        type: 'fa-icon',
        name: 'fab fa-youtube'
      },
      link: 'https://www.youtube.com/channel/UClmrAjJZoW5YQY1ZB6sLBwQ'
    },
    {
      name: 'Facebook',
      icon: {
        type: 'fa-icon',
        name: 'fab fa-facebook-f'
      },
      link: '#'
    },
    {
      name: 'Telegram',
      icon: {
        type: 'fa-icon',
        name: 'fab fa-telegram-plane'
      },
      link: '#'
    },
    {
      name: 'Zalo',
      icon: {
        type: 'img-link',
        name: 'assets/imgs/icons/zalo2.png'
      },
      link: '#'
    }
  ];

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService,
    private socketioService: SocketioService,
    private messageService: MessageService
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      
      socketioService.on(socketioService.messages.userActions.checkConnecting).subscribe(data => {
        if (this.getMenuErr) {
          this.getMenu();
        }
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.menu.new + '_' + appService.domain).subscribe(content => {
        if (content.newData.position === this.menuType && content.newData.lang === this.lang) {
          this.getMenu();
        }
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.menu.edit + '_' + appService.domain).subscribe(content => {
        var arr = content.dataArr;
        if (!arr) {
          arr = [ content.data ];
        }
        const rs = arr.find(item => item.position === this.menuType && item.lang === this.lang);
        if (rs) {
          this.getMenu();
        }
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.menu.delete + '_' + appService.domain).subscribe(content => {
        const rs = content.dataArr.find(item => item.position === this.menuType && item.lang === this.lang);
        if (rs) {
          this.getMenu();
        }
      }, err => console.log({ err: err, time: new Date() }));
    
      this.socketioService.on(this.socketioService.messages.embedCodes.new + '_' + this.appService.domain).subscribe(content => {
        this.EMBED_CODES.push(content.newData);
        this.renderEmbedCodes();
      }, err => console.log({ err: err, time: new Date() }));

      this.socketioService.on(this.socketioService.messages.embedCodes.edit + '_' + this.appService.domain).subscribe(content => {
        var arr = content.dataArr;
        if (!arr) {
          arr = [ content.data ];
        }
        arr.forEach(e => {
          const index = this.EMBED_CODES.findIndex(item => item.id === e.id);
          if (index !== -1) {
            this.EMBED_CODES.splice(index, 1, e);
          }
        });
        this.renderEmbedCodes();
      }, err => console.log({ err: err, time: new Date() }));

      this.socketioService.on(this.socketioService.messages.embedCodes.delete + '_' + this.appService.domain).subscribe(content => {
        content.dataArr.forEach(e => {
          const index = this.EMBED_CODES.findIndex(item => item.id === e.id);
          if (index !== -1) {
            this.EMBED_CODES.splice(index, 1);
          }
        });
        this.renderEmbedCodes();
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  ngOnInit(): void {
    // this.getEmbedCodes();

    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.path = val.url;
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
          this.getMenu();
        }
      }
    });
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
  }

  getMenu() {
    const where = 'WHERE position = "' + this.menuType + '" AND lang = "' + this.lang + '" AND enabled = 1';
    this.appService.getMenu(where).subscribe(res => {
      if (res.data) {
        res.data.forEach(e => {
          this.renderMenu(e);
        });
        this.menuData = res.data;
      } else {
        this.getMenuErr = res.err;
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.getMenuErr = err;
      console.log({ err: err, time: new Date() });
    });
  }

  renderMenu(e) {
    if (e.desData.type === 'href') {
      const tel = e.desData.value.indexOf('tel:');
      const mailto = e.desData.value.indexOf('mailto:');
      if (tel === -1 && mailto === -1) {
        e.target = '_blank';
      } else {
        e.target = '_self';
      }
    }
  }

  doAction(desData) {
    if (desData.type === 'action') {
      this.messageService.sendMessage(desData.value, null);
    }
  }

  getEmbedCodes() {
    const urlData = {
      table: this.appService.tables.embedCodes
    }
    this.appService.getSqlData(urlData).subscribe(res => {
      if (res.mess === 'ok') {
        this.EMBED_CODES = res.data;
        this.renderEmbedCodes();
      } else {
        console.log({ res: res, time: new Date(), on: 'getEmbedCodes() footer' });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  renderEmbedCodes() {
    const arr = [];
    this.EMBED_CODES.forEach(e => {
      if (e.enabled) {
        const item = {
          key: e.alias,
          value: e.content
        }
        arr.push(item);
      }
    });
    this.embedCodes = this.appService.arrayToObject(arr);
    // console.log(this.embedCodes);
  }

}
