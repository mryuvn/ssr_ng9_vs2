import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  
  @Input() isBrowser: boolean;
  
  @Output() toggleSidenav = new EventEmitter();
  
  siteValues: any = {};

  siteLangs: any = [];
  selectedLang: any = {};
  openLangsMenu: boolean = false;

  toolbarSettings: any = {
    container: true,
    socials: {
      btnBg: { type: 'accent' },
      btnColor: { type: 'light' }
    }
  };

  siteSocials: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitSiteData) {
        if (message.data.siteValues) {
          this.siteValues = message.data.siteValues;
          console.log(this.siteValues);
          this.getLanguages();
          this.getSocialBtns();
        };
      }
    });
  }

  ngOnInit(): void {
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
          console.log(this.appService.getErr(res.err, 'getLanguages()', 'ToolbarComponent'));
        }
      }).catch(err => console.log(this.appService.getErr(err, 'getLanguages()','ToolbarComponent')));
    }
  }

  getSocialBtns() {
    const siteSocials: any = [];
    this.siteValues.socials.forEach((item: any) => {
      const socialData = this.appService.socialBtns.find((i: any) => i.alias === item.type);
      const btn = {
        name: socialData?.alias,
        href: socialData?.href + item.value,
        faIcon: socialData?.faIcon,
        imgIcon: socialData?.imgIcon,
        enable: true
      }
      siteSocials.push(btn);
    });
    this.siteSocials = siteSocials;
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
