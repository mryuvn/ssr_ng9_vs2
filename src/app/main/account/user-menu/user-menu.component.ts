import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() userData: any;

  @Output() emitLogout = new EventEmitter();

  lang!: string;
  langsData: any = [
    {
      lang: 'vi',
      manageAcc: 'Quản lý tài khoản',
      logout: 'Đăng xuất'
    },
    {
      lang: 'en',
      manageAcc: 'Manage your account',
      logout: 'Log out'
    }
  ];
  langContent: any = {};

  accManagerLinks: any = [
    {
      href: 'https://accounts.yuadmin.vn',
      provider: 'admins'
    },
    {
      href: 'https://accounts.yuadmin.vn',
      provider: 'users'
    },
    {
      routes: [
        {
          lang: 'vi',
          content: '/vi/tai-khoan-cua-ban'
        }, {
          lang: 'en',
          content: '/en/your-account'
        }
      ],
      provider: 'clients'
    },
    {
      href: 'https://accounts.google.com',
      provider: 'GOOGLE'
    },
    {
      href: 'https://facebook.com',
      provider: 'FACEBOOK'
    }
  ];

  accManage: any = {};

  socialUser: SocialUser;

  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService,
    private authService: SocialAuthService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getLangData();
      }
    });
  }

  ngOnInit(): void {
    this.getLangData();

    const e = this.accManagerLinks.find((item: any) => item.provider === this.userData?.provider);
    if (e) {
      if (e.routes) {
        e.route = this.languageService.getLangValue(e.routes, this.lang);
      }
      this.accManage = e;
    }

    // this.authService.authState.subscribe((user) => {
    //   if (user) {
    //     this.socialUser = user;
    //     this.appService.updateSocialUserData(user, this.userData.username);
    //   }
    // }, err => console.log(err));
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  logout() {
    if (this.userData.userLevel === 'socials') {
      this.authService.signOut();
    }
    
    if (typeof (Storage) !== "undefined") {
      const isLogeds = this.appService.isArray(localStorage.getItem("isLogeds")).data;
      isLogeds.forEach((e: any) => {
        if (e.alias === this.userData.alias) {
          e.isLoged = false;
        }
      });
      localStorage.setItem("isLogeds", JSON.stringify(isLogeds));
    }

    this.emitLogout.emit();
    this.appService.userData = {};

    this.messageService.sendMessage(this.socketioService.messages.user.logout, this.userData.alias);

    const dataEmit = {
      message: this.socketioService.messages.user.logout + '_' + this.appService.domain,
      emit: false,
      broadcast: true,
      content: {
        alias: this.appService.userData.alias
      }
    }
    this.socketioService.emit('client_emit', dataEmit);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
