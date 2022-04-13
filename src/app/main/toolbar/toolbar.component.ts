import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  
  @Input() isBrowser: boolean;
  @Input() navIsFixed: boolean;
  
  @Output() toggleSidenav = new EventEmitter();
  
  userData: any = {};

  domainData: any = {};
  siteValues: any = {};
  menuData: any = [];

  siteLangs: any = [];
  selectedLang: any = {};
  openLangsMenu: boolean = false;

  defaultSettings: any = {
    container: true,
    fixed: true,
    main: {
      height: {
        value: 80,
        unit: 'px'
      },
      background: { type: 'primary' }
    },
    onFixed: {
      height: {
        value: 60,
        unit: 'px'
      },
      background: { type: 'primary' },
      styles: {
        boxShadow: '0 2px 5px -5px #000'
      }
    },
    logo: {
      position: 'left',
      height: { value: 80, unit: '%' }
    },
    siteName: {
      position: 'hidden'
    },
    socials: {
      position: 'right',
      btnStyles: {
        width: '34px',
        height: '34px'
      }
    },
    contacts: {
      position: 'right',
      btnStyles: {
        width: '34px',
        height: '34px'
      },
      tel: {
        viewMod: 'icon-only'
      },
      email: {
        viewMod: 'icon-only'
      }
    },
    langs: {
      position: 'right'
    },
    tools: {
      position: 'right'
    },
    menu: {
      position: 'left',
      clear: false,
      height: null,
      textAlign: 'center'
    }
  };

  toolbarSettings: any;

  toolOpen!: string | null;

  layoutLoaded!: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private messageService: MessageService,
    private layoutService: LayoutService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitSiteData) {
        this.domainData = message.data.domainData;
        this.getToolbarSettings();

        if (message.data.menu) { this.menuData = message.data.menu };

        if (message.data.siteValues) {
          this.siteValues = message.data.siteValues;
          this.getLanguages();
          this.getContacts();
        };
      }

      if (message.text === messageService.messages.layoutLoaded) {
        this.layoutLoaded = message.data;
      }

      if (message.text === messageService.messages.openLogin) {
        this.toolOpen = 'userMenu';
      }
    });
  }

  ngOnInit(): void {
    this.userData = this.appService.getUserData();

    if (this.isBrowser) {
      const userMessages = {
        login: this.socketioService.messages.user.login + '_' + this.appService.domain,
        logout: this.socketioService.messages.user.logout + '_' + this.appService.domain
      }

      this.socketioService.on(userMessages.login).subscribe(content => {
        if (!this.userData.username || this.userData.alias === content.alias) {
          this.userData = this.appService.getUserData();
        };
      }, err => this.logErr(err, 'socketioService.on(userMessages.login)'));

      this.socketioService.on(userMessages.logout).subscribe(content => {
        if (this.userData.alias === content.alias) {
          this.userData = this.appService.getUserData();
        }
      }, err => this.logErr(err, 'socketioService.on(userMessages.logout)'));
    }
  }

  getToolbarSettings() {
    let toolbar = this.domainData.layoutSettings.toolbar;
    
    if (!toolbar) { toolbar = this.defaultSettings };

    toolbar.mainStyles = { height: toolbar.main.height }
    toolbar.main.bg = {
      background: toolbar.main.background,
      styles: toolbar.main.styles
    }

    toolbar.onFixedStyles = { height: toolbar.onFixed.height }
    toolbar.onFixed.bg = {
      background: toolbar.onFixed.background,
      styles: toolbar.onFixed.styles
    }
    
    this.layoutService.getElementStyles(toolbar.mainStyles);
    this.layoutService.getElementStyles(toolbar.main.bg);
    this.layoutService.getElementStyles(toolbar.onFixedStyles);
    this.layoutService.getElementStyles(toolbar.onFixed.bg);

    if (!toolbar.logo) { toolbar.logo = this.defaultSettings.logo };

    this.layoutService.getDefaultLogo(this.domainData, toolbar.logo);
    toolbar.logo.src = this.appService.getFileSrc(toolbar.logo);
    if (!toolbar.logo.src) { toolbar.logo.src = 'assets/imgs/logo/logo.png' };

    const logoWidthValue = toolbar.logo.width?.value;
    if (logoWidthValue) { toolbar.logo.logoWidth = logoWidthValue + toolbar.logo.width?.unit }
    const logoHeightValue = toolbar.logo.height?.value;
    if (logoHeightValue) { toolbar.logo.logoHeight = logoHeightValue + toolbar.logo.height?.unit };
    toolbar.logo.styles = this.appService.isObject(toolbar.logo.styles).data;

    if (!toolbar.menu) { toolbar.menu = this.defaultSettings.menu };
    const toolbarMenuHeightValue = toolbar.menu.height?.value;
    if (toolbarMenuHeightValue) { toolbar.menu.menuHeight = toolbarMenuHeightValue + toolbar.menu.height?.unit };
    if (!toolbar.menu.item) { toolbar.menu.item = {} };
    this.layoutService.getElementStyles(toolbar.menu.item);
    if (!toolbar.menu.itemOnHover) { toolbar.menu.itemOnHover = {} };
    this.layoutService.getElementStyles(toolbar.menu.itemOnHover);

    if (!toolbar.contacts) { toolbar.contacts = this.defaultSettings.contacts };
    if (!toolbar.contacts.btnStyles) { toolbar.contacts.btnStyles = this.defaultSettings.contacts.btnStyles };
    if (!toolbar.contacts.tel) { toolbar.contacts.tel = this.defaultSettings.contacts.tel };
    if (!toolbar.contacts.email) { toolbar.contacts.email = this.defaultSettings.contacts.email };

    if (!toolbar.socials) { toolbar.socials = this.defaultSettings.socials };
    if (!toolbar.socials.btnStyles) { toolbar.socials.btnStyles = this.defaultSettings.socials.btnStyles };

    if (this.isBrowser) {
      const toolbarEl = document.getElementById("toolbar") as HTMLElement;

      const mainColor = toolbar.main?.color;
      if (mainColor) {
        this.layoutService.findColor(mainColor);
        const textColor = mainColor.rgba ? mainColor.rgba : ('#' + mainColor.hex);
        toolbarEl?.style.setProperty("--textColor", textColor);
      }
      const mainColorOnHover = toolbar.main?.colorOnHover;
      if (mainColorOnHover) {
        this.layoutService.findColor(mainColorOnHover);
        const textColorOnHover = mainColorOnHover.rgba ? mainColorOnHover.rgba : ('#' + mainColorOnHover.hex);
        toolbarEl?.style.setProperty('--textColorOnHover', textColorOnHover);
      }

      const onFixedColor = toolbar.onFixed?.color;
      if (onFixedColor) {
        this.layoutService.findColor(onFixedColor);
        const textColorOnFixed = onFixedColor.rgba ? onFixedColor.rgba : ('#' + onFixedColor.hex);
        toolbarEl?.style.setProperty('--textColorOnFixed', textColorOnFixed);
      }
      const onfixedColorOnHover = toolbar.onFixed?.colorOnHover;
      if (onfixedColorOnHover) {
        this.layoutService.findColor(onfixedColorOnHover);
        const textColorOnFixedOnHover = onfixedColorOnHover.rgba ? onfixedColorOnHover.rgba : ('#' + onfixedColorOnHover.hex);
        toolbarEl?.style.setProperty('--textColorOnFixedOnHover', textColorOnFixedOnHover);
      }
    }

    this.toolbarSettings = toolbar;
    // console.log(this.toolbarSettings);
  }

  getLanguages() {
    const getSiteLangs = () => {
      const siteLangs: any = [];
      this.appService.domainData.languages.forEach((e: any) => {
        if (e.enabled) {
          const item: any = {
            lang: e.lang,
            flagCode: e.flagCode,
            name: e.lang.toUpperCase()
          }

          const langData = this.appService.languages.find((i: any) => i.lang === e.lang);
          if (langData) {
            item.flagCode = langData.code;
            item.name = langData.nameObj.vernacular;
          }
          siteLangs.push(item);
        }
      });
      this.siteLangs = siteLangs;

      const selectedLang = siteLangs.find((i: any) => i.lang === this.appService.sitelang);
      if (selectedLang) { this.selectedLang = selectedLang };
    }

    if (this.appService.languages) {
      getSiteLangs();
    } else {
      this.appService.getLanguages().then(res => {
        if (res.data) {
          getSiteLangs();
        } else {
          console.log(this.appService.logErr(res.err, 'getLanguages()', 'ToolbarComponent'));
        }
      }).catch(err => console.log(this.appService.logErr(err, 'getLanguages()','ToolbarComponent')));
    }
  }

  getContacts() {
    const tel = this.siteValues.tels[0];
    if (tel) {
      this.toolbarSettings.contacts.tel.value = tel.value;
      this.toolbarSettings.contacts.tel.viewValue = tel.viewValue;
    }

    const email = this.siteValues.emails[0];
    if (email) {
      this.toolbarSettings.contacts.email.mail = email.mail;
    }
  }

  changeLanguage(item: any) {
    if (item.lang !== this.selectedLang.lang) {
      this.selectedLang = item;
      this.appService.sitelang = item.lang;
      this.messageService.sendMessage(this.messageService.messages.changeLanguage, item.lang);
    }
  }

  openTool(option: string) {
    if (option === this.toolOpen) {
      this.toolOpen = null;
    } else {
      this.toolOpen = option;
    }
  }

  login($event: any) {
    this.toolOpen = null;
    setTimeout(() => {
      this.userData = $event;
    }, 300);
  }

  logout() {
    this.toolOpen = null;
    setTimeout(() => {
      this.userData = {};
    }, 300);
  }

  logErr(err: any, functionName: string) {
    this.appService.logErr(err, functionName, 'ToolbarComponent');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
