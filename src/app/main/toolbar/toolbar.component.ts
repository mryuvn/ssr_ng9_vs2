import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  
  @Input() isBrowser: boolean;
  @Input() navIsFixed: boolean;
  
  @Output() toggleSidenav = new EventEmitter();
  
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
      color: { type: 'white' },
      height: {
        value: 80,
        unit: 'px'
      },
      bg: {
        background: { type: 'primary' },
        styles: {
          opacity: 0.3
        }
      }
    },
    onFixed: {
      color: { type: 'white' },
      height: {
        value: 60,
        unit: 'px'
      },
      bg: {
        background: { type: 'primary' },
        styles: {
          opacity: 1,
          boxShadow: '0 2px 5px -5px #000'
        }
      }
    },
    logo: {
      position: 'left',
      styles: {
        width: '44px'
      }
    },
    siteName: {
      position: 'hidden'
    },
    socials: {
      position: 'right',
      btnStyles: {
        width: '40px',
        height: '40px'
      }
    },
    contacts: {
      position: 'right',
      btnStyles: {
        width: '40px',
        height: '40px'
      },
      tel: {
        iconOnly: false,
      },
      email: {
        iconOnly: true,
      }
    },
    langs: {
      position: 'right'
    },
    tools: {
      position: 'right'
    },
    menu: {
      // position: 'clear right',
      position: 'left',
      height: null,
      textAlign: 'center'
    }
  };

  toolbarSettings: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private messageService: MessageService,
    private layoutService: LayoutService
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
    });
  }

  ngOnInit(): void {
  }

  getToolbarSettings() {
    let toolbar = this.domainData.layoutSettings.toolbar;
    if (!toolbar) { toolbar = this.defaultSettings };
    
    this.layoutService.getElementStyles(toolbar.main);
    this.layoutService.getElementStyles(toolbar.main.bg);
    this.layoutService.getElementStyles(toolbar.onFixed);
    this.layoutService.getElementStyles(toolbar.onFixed.bg);

    if (!toolbar.logo) { toolbar.logo = this.defaultSettings.logo };
    this.layoutService.getDefaultLogo(this.domainData, toolbar.logo);
    toolbar.logo.src = this.appService.getFileSrc(toolbar.logo);
    if (!toolbar.logo.src) {
      toolbar.logo.src = 'assets/imgs/logo/logo.png';
    }
    
    this.toolbarSettings = toolbar;
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
      this.toolbarSettings.contacts.email.mail = email;
    }
  }

  changeLanguage(item: any) {
    if (item.lang !== this.selectedLang.lang) {
      this.selectedLang = item;
      this.appService.sitelang = item.lang;
      this.messageService.sendMessage(this.messageService.messages.changeLanguage, item.lang);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
