import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

import { SetTagsService } from './services/set-tags.service';
import { AppService } from './services/app.service';
import { LanguageService } from './services/language.service';
import { MessageService } from './services/message.service';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'yufx',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'YuFX.vn';

  lang: string;
  siteValues: any;
  userData: any;

  isBrowser: boolean;
  loadingData: any;
  navIsFixed: boolean;

  sidenavWidth: string = '280px';
  sidenavOpen: boolean;
  menuData: any = [];

  siteLangs: any = [];
  language: any;
  getLanguageErr: boolean;

  themeSettings: any;
  openThemeSettings: boolean;
  toolbarHeight: number = 60;

  routerLoading: boolean;
  routerLoaded: boolean;

  dialogOpen: boolean;
  toolOpen: any;
  pageFullscreen: boolean = false;

  visitorData: any = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private setTagsService: SetTagsService,
    private appService: AppService,
    private languageService: LanguageService,
    private socketioService: SocketioService,
    private messageService: MessageService
  ) {
    setTagsService.setCanonicalURL();
    setTagsService.setTags();

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      router.events.subscribe(val => {
        if (val instanceof RoutesRecognized) {
          if (this.siteValues) {
            this.routerLoading = true;
          }
          const lang = val.state.root.firstChild.params.lang;
          if (lang !== this.lang) {
            this.lang = lang;
            this.getSiteValues(true);
          }

          const path = val.url;
          setTimeout(() => {
            if (this.router.url !== path) {
              this.routerLoading = false;
            }
          }, 500);
        }
      });

      socketioService.on(socketioService.messages.userActions.checkConnecting).subscribe(data => {
        if (typeof (Storage) !== "undefined") {
          var clientUser = localStorage.getItem('clientUser');
          if (!clientUser) {
            clientUser = data.defaultUser;
            localStorage.setItem('clientUser', clientUser);
          }
        } else {
          clientUser = data.defaultUser;
        }
        appService.clientUser = clientUser;
        messageService.sendMessage(messageService.messages.emitClientUser, clientUser);

        if (this.loadingData) {
          this.getSiteValues(false);
        }
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.domains.edit).subscribe(content => {
        if (content.data.id === appService.domainID) {
          this.getSiteValues(false);
        }
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.siteValues.new + '_' + appService.domain).subscribe(content => {
        this.getSiteValues(false);
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.siteValues.edit + '_' + appService.domain).subscribe(content => {
        this.getSiteValues(false);
      }, err => console.log({ err: err, time: new Date() }));

      socketioService.on(socketioService.messages.siteValues.delete + '_' + appService.domain).subscribe(content => {
        this.getSiteValues(false);
      }, err => console.log({ err: err, time: new Date() }));
    }

    messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.routerLoaded) {
        if (message.data) {
          setTimeout(() => {
            this.routerLoading = false;
            setTimeout(() => {
              this.routerLoaded = true;
            }, 100);
          }, 100);
        } else {
          this.routerLoading = true;
          this.routerLoaded = false;
        }
      }

      if (message.text === messageService.messages.sendUserData) {
        this.userData = message.data;
      }

      if (message.text === messageService.messages.removeUserData) {
        this.userData = null;
      }

      if (message.text === messageService.messages.openThemeSettings) {
        this.openThemeSettings = true;
      }

      if (message.text === messageService.messages.updateThemeSettings) {
        this.themeSettings = message.data.themeSettings;
        this.setToolbarHeight();
        this.setStyles();
      }

      if (message.text === messageService.messages.pageFullscreen) {
        this.pageFullscreen = message.data;
      }
    });
  }

  getSiteValues(setStyles) {
    this.appService.getSiteValues().then(res => {
      if (res.data) {
        this.themeSettings = this.appService.themeSettings;
        this.messageService.sendMessage(this.messageService.messages.emitThemeSettings, this.themeSettings);
        this.setToolbarHeight();
        if (setStyles) {
          this.setStyles();
        }
        this.siteValues = res.data.find(item => item.lang === this.lang);
        if (this.siteValues) {
          this.getLanguages();
          this.messageService.sendMessage(this.messageService.messages.emitSiteValues, this.siteValues);
        } else {
          this.router.navigate(['/vi']);
        }
        setTimeout(() => {
          this.loadingData = { ok: true };
        }, 1000);
      } else {
        console.log({ err: res.err, time: new Date() });
        this.loadingErr();
      }
    }).catch(err => {
      console.log({ err: err, time: new Date() });
      this.loadingErr();
    });
  }

  getLanguages() {
    this.appService.getLanguages(this.lang).then(res => {
      if (res.data) {
        this.language = this.appService.langsData;
        this.getLanguageErr = false;
        const siteLangs = [];
        this.appService.siteValues.forEach(e => {
          const data = res.data.find(item => item.lang === e.lang);
          if (data) {
            data.disable = !e.enabled;
            siteLangs.push(data);
          }
        });
        this.siteLangs = siteLangs;
      } else {
        console.log({ res: res, time: new Date() });
        this.getLanguageErr = true;
      }
    }).catch(err => {
      console.log({ err: err, time: new Date() });
      this.getLanguageErr = true;
    });
  }

  setStyles() {
    const wrapper = this.document.getElementById('wrapper');
    setTimeout(() => {
      if (wrapper) {
        wrapper.style.setProperty('--lightColor', this.themeSettings.light.value);
        wrapper.style.setProperty('--lightBorder', this.themeSettings.light.defaultBorder);

        wrapper.style.setProperty('--accentColor', this.themeSettings.accent.value);
        wrapper.style.setProperty('--accentBorder', this.themeSettings.accent.defaultBorder);
        wrapper.style.setProperty('--accentInvert', this.themeSettings.accent.invert);
        wrapper.style.setProperty('--accentDark', this.themeSettings.accent.darkColor);

        wrapper.style.setProperty('--warnColor', this.themeSettings.warn.value);
        wrapper.style.setProperty('--warnBorder', this.themeSettings.warn.defaultBorder);
        wrapper.style.setProperty('--warnInvert', this.themeSettings.warn.invert);
        wrapper.style.setProperty('--warnDark', this.themeSettings.warn.darkColor);

        wrapper.style.setProperty('--primaryColor', this.themeSettings.primary.value);
        wrapper.style.setProperty('--primaryBorder', this.themeSettings.primary.defaultBorder);
        wrapper.style.setProperty('--primaryInvert', this.themeSettings.primary.invert);

        wrapper.style.setProperty('--backgroundColor', this.themeSettings.background.value);
        wrapper.style.setProperty('--backgroundBorder', this.themeSettings.background.defaultBorder);
        wrapper.style.setProperty('--backgroundInvert', this.themeSettings.background.invert);

        if (this.themeSettings.toolbar) {
          wrapper.style.setProperty('--toolbarHeight', this.themeSettings.toolbar.height + 'px');
        }
      }
    }, 1);
  }

  loadingErr() {
    setTimeout(() => {
      this.loadingData = this.languageService.getLoadingErr(this.lang);
    }, 1000);
  }

  setToolbarHeight() {
    if (this.navIsFixed) {
      if (this.themeSettings.toolbar.heightOnFixed) {
        this.toolbarHeight = this.themeSettings.toolbar.heightOnFixed;
      } else {
        this.toolbarHeight = 60;
      }
    } else {
      if (this.themeSettings.toolbar.height) {
        this.toolbarHeight = this.themeSettings.toolbar.height;
      } else {
        this.toolbarHeight = 60;
      }
    }
  }

  closeTools(favouriteTool, cartTool, accountTool) {
    this.toolOpen = null;
    favouriteTool.openMenu = false;
    cartTool.openMenu = false;
    accountTool.openUserMenu = false;
    accountTool.openLogin = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let fixedNumber = 50;
    fixedNumber = 500;
    if (number > fixedNumber) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < fixedNumber) {
      this.navIsFixed = false;
    }
    if (this.themeSettings) {
      this.setToolbarHeight();
    }
  } scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
      }
    })();
  }
  
}
