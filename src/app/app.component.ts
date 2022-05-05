import { Component, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { SetTagsService } from './services/set-tags.service';
import { AppService } from './services/app.service';
import { MessageService } from './services/message.service';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'wep-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  siteName = 'ANGULAR9 SSR WEB DEMO';

  isBrowser: boolean;
  layoutLoaded: boolean = false;
  routerLoading: boolean = false;
  navIsFixed: boolean = false;
  toolOpen: boolean = false;
  sidenavOpen: boolean = false;
  loadingLogo!: string;
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private setTagsService: SetTagsService,
    private appService: AppService,
    private socketioService: SocketioService,
    private messageService: MessageService
  ) {
    setTagsService.setCanonicalURL();
    setTagsService.setTags();

    this.isBrowser = appService.isBrowser;

    messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitSiteData) {
        const logos = message.data.domainData?.layoutSettings?.logos;
        if (logos) {
          const img = logos[0];
          if (img) {
              this.loadingLogo = appService.getFileSrc(img);
          }
        }
      }
      if (message.text === messageService.messages.layoutLoaded) {
        this.layoutLoaded = message.data;
        if (this.isBrowser) {
          this.scrollToTop();
        }
      }

      if (message.text === messageService.messages.routerLoading) {
        this.routerLoading = message.data;
        this.sidenavOpen = false;
      }
    });
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
    // fixedNumber = 100;
    if (number > fixedNumber) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < fixedNumber) {
      this.navIsFixed = false;
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
