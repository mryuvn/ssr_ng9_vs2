import { Component, Inject, PLATFORM_ID, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { SocketioService } from 'src/app/services/socketio.service';
import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';

import { SocialAuthService } from "angularx-social-login";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountMenuComponent implements OnInit {

  @Input() lang: string;

  @Output() openTool = new EventEmitter();
  @Output() closeTool = new EventEmitter();

  subscription: Subscription;
  socket: any;

  isLoged: any = {};
  openLogin: Boolean;
  checkLoginErr: any;

  userData: any;
  openUserMenu: Boolean;
  avatarLandscape: Boolean;

  langsData: any = [
    {
      lang: 'vi',
      welcome: 'Xin chào',
      signOut: 'Đăng xuất',
      accManager: 'Quản lý tài khoản',
      menuItems: [
        {
          faIcon: 'fas fa-cart-arrow-down',
          title: 'Giỏ hàng',
          path: 'gio-hang',
          validFor: []
        },
        {
          faIcon: 'fas fa-shopping-cart',
          title: 'Quản lý đơn hàng',
          path: 'tai-khoan-nguoi-dung/quan-ly-don-hang',
          validFor: ['members', 'socials']
        },
        {
          faIcon: 'fas fa-tools',
          title: 'Cấu hình giao diện',
          action: 'openThemeSettings',
          validFor: ['admins', 'users']
        },
        {
          faIcon: 'fas fa-user-cog',
          title: 'Thông tin tài khoản',
          path: 'tai-khoan-nguoi-dung/thong-tin-tai-khoan',
          // href: 'https://accounts.vfl-admin.com/',
          validFor: ['all']
        },
        {
          faIcon: '',
          matIcon: 'web',
          title: 'Quản lý nội dung Web',
          href: 'https://dashboards.vfl-admin.com/',
          validFor: ['admins', 'users']
        }
      ]
    },
    {
      lang: 'en',
      welcome: 'Welcome,',
      signOut: 'Sign out',
      accManager: 'Account manager',
      menuItems: [
        {
          faIcon: 'fas fa-cart-arrow-down',
          title: 'Shopping cart',
          path: 'shopping-cart',
          validFor: ['members', 'socials']
        },
        {
          faIcon: 'fas fa-shopping-cart',
          title: 'Orders manager',
          path: 'orders-manager',
          validFor: ['members', 'socials']
        },
        {
          faIcon: 'fas fa-tools',
          title: 'Cấu hình giao diện',
          action: 'openThemeSettings',
          validFor: ['admins', 'users']
        },
        {
          faIcon: 'fas fa-user-cog',
          title: 'Account infomations',
          path: 'account-manager',
          // href: 'https://accounts.vfl-admin.com/',
          validFor: ['admins', 'users']
        },
        {
          faIcon: '',
          matIcon: 'web',
          title: 'Web content management',
          href: 'https://dashboards.vfl-admin.com/',
          validFor: ['admins', 'users']
        }
      ]
    }
  ];
  data: any;

  accTypes: any = [
    {
      provider: 'admin',
      faIcon: 'fas fa-user',
      href: 'https://accounts.vfl-admin.com'
    }, {
      provider: 'user',
      faIcon: 'fas fa-user',
    }, {
      provider: 'FACEBOOK',
      faIcon: 'fab fa-facebook',
      href: 'https://facebook.com/settings'
    }, {
      provider: 'GOOGLE',
      faIcon: 'fab fa-google',
      href: 'https://myaccount.google.com'
    }
  ];
  accManager: any = {};

  menuItems: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private socketioService: SocketioService,
    private appService: AppService,
    private messageService: MessageService,
    private authService: SocialAuthService
  ) { 
    if (isPlatformBrowser(platformId)) {
      if (typeof (Storage) !== "undefined") {
        var isLoged = localStorage.getItem('isLoged');
      }
      if (isLoged) {
        this.isLoged = appService.isObject(isLoged);
        this.checkLogin(this.isLoged);
      }

      this.socket = socketioService.on(socketioService.messages.emitLoginData + '_' + appService.domain).subscribe(content => {
        if (!this.userData) {
          if (typeof (Storage) !== "undefined") {
            var isLoged = localStorage.getItem('isLoged');
            if (isLoged) {
              this.isLoged = appService.isObject(isLoged);
            }
          }
          if (this.isLoged.username === content.userData.username && this.isLoged.userLevel === content.userData.userLevel) {
            this.openLogin = false;
            this.openUserMenu = false;
            this.userData = content.userData;
            appService.userData = this.userData;
            this.messageService.sendMessage(this.messageService.messages.sendUserData, this.userData);
            this.getAccManager();
            this.checkAvatar(this.userData.avatarLink);
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(socketioService.messages.emitLogOut + '_' + appService.domain).subscribe(content => {
        if (this.userData) {
          if (this.userData.username === content.userData.username && this.userData.userLevel === content.userData.userLevel) {
            this.userData = null;
            appService.userData = {};
            this.messageService.sendMessage(this.messageService.messages.removeUserData, null);
            this.openUserMenu = false;
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(socketioService.messages.userActions.checkConnecting).subscribe(data => {
        if (this.checkLoginErr) {
          this.checkLogin(this.isLoged);
        }
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.text === this.messageService.messages.sendUserData) {
        this.openLogin = false;
        this.userData = message.data;
        this.getAccManager();
        this.checkAvatar(this.userData.avatarLink);
      }
    });

    this.authService.authState.subscribe((user) => {
      // console.log(user);
    });
  }

  getlangData() {
    this.data = this.langsData.find(item => item.lang === this.lang);
    if (!this.data) {
      this.data = this.langsData[0];
    }
  }

  checkLogin(isLoged) {
    if (this.isLoged.status === true) {
      if (isLoged.userLevel === 'admins' || isLoged.userLevel === 'users') {
        const dataPost = {
          username: isLoged.username,
          login_code: isLoged.login_code,
          userLevel: isLoged.userLevel
        }
        this.appService.checkUserLogin(dataPost).subscribe(res => {
          if (res.mess === 'ok') {
            this.checkLoginErr = null;
            const e = res.userData;
            e.provider = 'admin';
            const userData = this.appService.setUserData(e);
            this.messageService.sendMessage(this.messageService.messages.sendUserData, userData);
          } else {
            this.checkLoginErr = 'fail';
            console.log({ res: res, time: new Date() });
          }
        }, err => {
          this.checkLoginErr = 'fail';
          console.log({ err: err, time: new Date() });
        });
      } else if (isLoged.userLevel === 'members') {
        const data = {
          username: isLoged.username,
          login_code: isLoged.login_code
        }
        this.appService.memberLogin(data).subscribe(res => {
          if (res.mess === 'ok') {
            this.checkLoginErr = null;
            const e = {
              username: res.username,
              nickname: res.nickname,
              fullname: res.fullname,
              avatar: res.avatar,
              title: res.personal_info.title,
              national: res.personal_info.national,
              location: res.personal_info.location,
              address: res.personal_info.address,
              tels: this.appService.isArray(res.contact_info.tels).data,
              emails: this.appService.isArray(res.contact_info.emails).data,
              company: res.company_info,
              userLevel: 'members',
              provider: 'user',
              status: res.status
            }
            const userData = this.appService.setUserData(e);
            this.messageService.sendMessage(this.messageService.messages.sendUserData, userData);
          } else {
            this.checkLoginErr = 'fail';
            console.log({ res: res, time: new Date() });
          }
        }, err => {
          this.checkLoginErr = 'fail';
          console.log({ err: err, time: new Date() });
        });
      } else {
        // console.log(isLoged);
      }
    }
  }

  getAccManager() {
    const e = this.accTypes.find(item => item.provider === this.userData.provider);
    if (e) {
      if (e.provider === 'admin') {
        if (this.userData === 'admins') {
          var query = '?u=' + this.userData.username;
        } else {
          var query = '?m=' + this.userData.username;
        }
        e.href = e.href + query;
        e.route = null;
      } else if (e.provider === 'user') {
        e.route = '/' + this.lang + '/' + this.appService.getModuleRoute(this.lang).userAccount;
        e.href = null;
      } else {
        e.route = null;
      }
      this.accManager = e;
    }
  }

  checkAvatar(avatarLink) {
    if (avatarLink) {
      const img = new Image();
      img.src = avatarLink;
      img.onload = () => {
        if (img.naturalWidth > img.naturalHeight) {
          this.avatarLandscape = true;
        }
      }
    }
  }

  openMenu() {
    if (this.userData) {
      this.getlangData();
      this.getMenuItems();
      this.openLogin = false;
      setTimeout(() => {
        this.openUserMenu = true;
      }, 10);
    } else {
      this.openUserMenu = false;
      this.openLogin = true;
    }
    this.openTool.emit();
  }

  getMenuItems() {
    const menuItems = [];
    this.data.menuItems.forEach(item => {
      const all = item.validFor.find(i => i === 'all');
      if (all) {
        menuItems.push(item);
      } else {
        const valid = item.validFor.find(i => i === this.userData.userLevel);
        if (valid) {
          menuItems.push(item);
        }
      }
    });

    menuItems.forEach(e => {
      if (e.path) {
        e.route = '/' + this.lang + '/' + e.path;
      }
      if (e.href && !e.query) {
        if (this.userData.userLevel === 'admins') {
          e.query = '?u=' + this.userData.username;
        } else if (this.userData.userLevel === 'users') {
          e.query = '?m=' + this.userData.username;
        } else {
          e.query = '';
        }
        e.href = e.href + e.query;
      }
    });
    this.menuItems = menuItems;
  }

  doAction(action) {
    this.messageService.sendMessage(action, null);
  }

  closeAccMenu() {
    this.openUserMenu = false;
    this.openLogin = false;
    this.closeTool.emit();
    
    setTimeout(() => {
      this.data = null;
    }, 300);
  }

  logOut() {
    if (this.userData.userLevel === 'socials') {
      this.authService.signOut();
    }
    
    const emitData = {
      message: this.socketioService.messages.emitLogOut + '_' + this.appService.domain,
      emit: false,
      broadcast: true,
      content: {
        userData: this.userData
      }
    }
    this.socketioService.emit("client_emit", emitData);

    this.openUserMenu = false;
    this.userData = this.appService.logOut();
    this.messageService.sendMessage(this.messageService.messages.removeUserData, null);
  }

}
