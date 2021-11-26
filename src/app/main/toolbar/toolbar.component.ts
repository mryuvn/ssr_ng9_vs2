import { Component, Inject, PLATFORM_ID, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  @Input() navIsFixed: boolean;
  @Input() selectedLang: any;
  @Input() siteLangs: any;
  @Input() themeSettings: any;
  @Input() siteValues: any;
  
  @Output() emitMenuData = new EventEmitter();
  @Output() toggleSidenav = new EventEmitter();
  @Output() openTool = new EventEmitter();
  @Output() closeTool = new EventEmitter();
  
  subscription: Subscription;
  
  lang: string;
  path: string;

  menuType: string = 'main';
  navs: any = [];
  menuData: any = {
    top: [],
    main: [],
    btn: {}
  };
  
  routerLoading: boolean = false;
  getMenuErr: boolean = false;

  socials: any = [
    {
      icon: {
        type: 'fa-icon',
        name: 'fab fa-twitter'
      },
      href: '#'
    },
    {
      icon: {
        type: 'fa-icon',
        name: 'fab fa-facebook-f'
      },
      href: '#'
    },
    {
      icon: {
        type: 'fa-icon',
        name: 'fab fa-linkedin-in'
      },
      href: '#'
    }
  ]

  openMenu: boolean = false;
  openSearch: boolean = false;

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
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
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.routerLoading = true;
        this.path = val.url;
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getMenu();
        }

        setTimeout(() => {
          const newPath = this.router.url;
          if (newPath !== this.path) {
            this.path = newPath;
            this.setActivePath(this.navs);
            // this.emitMenuData.emit(this.navs);
            this.renderMenus();
          }
          this.routerLoading = false;
        }, 1000);
      }
    });
  }

  setActivePath(menuData) {
    // console.log(menuData);
  }

  getMenu() {
    const where = 'WHERE position = "' + this.menuType + '" AND lang = "' + this.lang + '" AND enabled = 1';
    this.appService.getMenu(where).subscribe(res => {
      if (res.data) {
        this.getMenuErr = false;
        this.navs = res.data;
        this.renderMenus();
      } else {
        console.log({ res: res, time: new Date(), on: 'getmenu() toolbar' });
        this.getMenuErr = true;
      }
    }, err => {
      console.log({ err: err, time: new Date() });
      this.getMenuErr = true;
    });
  }

  renderMenus() {
    const menuData = {
      top: [],
      main: [],
      btn: {}
    };
    this.navs.forEach(e => {
      if (e.desData.type === 'href') {
        const tel = e.desData.value.indexOf('tel:');
        const mailto = e.desData.value.indexOf('mailto:');
        if (tel === -1 && mailto === -1) {
          e.target = '_blank';
        } else {
          e.target = '_self';
        }
      }

      if (!e.iconData.name) {
        e.iconData.name = 'fas fa-list';
      }

      if (e.viewMode) {
        e.isHome = e.viewMode.indexOf('home') !== -1;
        const isBtn = e.viewMode.indexOf('btn') === -1 ? false : true;
        if (isBtn) {
          e.desData.title = e.title;
          menuData.btn = e;
        } else {
          const top = e.viewMode.indexOf('top');
          if (top !== -1) {
            menuData.top.push(e);
          } else {
            menuData.main.push(e);
          }
        }
      } else {
        menuData.main.push(e);
      }
    });
    this.menuData = menuData;
    this.setActivePath(this.menuData);
    this.appService.menuData = this.menuData;
    this.emitMenuData.emit(this.menuData.main);
    this.messageService.sendMessage(this.messageService.messages.emitMenuData, this.menuData);
  }

  doAction(desData) {
    if (desData.type === 'action') {
      this.messageService.sendMessage(desData.value, null);
    }
  }

  changeLanguage(item) {
    if (item.lang !== this.lang) {
      this.selectedLang = item;
      this.messageService.sendMessage(this.messageService.messages.changeLanguage, item);
    }
  }
}
