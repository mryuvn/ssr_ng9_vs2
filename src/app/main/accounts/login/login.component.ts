import { Component, Inject, OnInit, Input, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MessageService } from 'src/app/services/message.service';
import { LanguageService } from 'src/app/services/language.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() lang: string;

  @Output() close = new EventEmitter();
  @Output() emitUserData = new EventEmitter();

  subscription: Subscription;

  langData: any = {};
  langsData: any = [
    {
      lang: 'vi',
      formTitle: 'Đăng nhập tài khoản',
      userOptions: [
        {
          type: 'client',
          title: 'Thành viên'
        },
        {
          type: 'admin',
          title: 'Quản trị viên'
        }
      ],
      accTypes: [
        {
          value: 'email',
          faIcon: 'fas fa-envelope',
          matIcon: 'email',
          title: 'Địa chỉ Email'
        },
        {
          value: 'phone',
          faIcon: 'fas fa-phone-alt',
          matIcon: 'phone',
          title: 'Số điện thoại'
        },
        {
          value: 'userName',
          faIcon: 'fas fa-user',
          matIcon: 'person',
          title: 'Tên đăng nhập'
        }
      ],
      username: {
        label: 'Tên người dùng',
        placeholder: 'Nhập tên đăng nhập của bạn!'
      },
      password: {
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu của bạn!'
      },
      login: 'Đăng nhập',
      forgotPass: 'Quên mật khẩu?',
      or: 'Hoặc',
      signInWith: 'Đăng nhập bằng',
      signUp: {
        label: 'Bạn chưa có tài khoản?',
        suggestions: 'Tạo tài khoản'
      },
      loginSuccess: 'Đăng nhập thành công!'
    },
    {
      lang: 'en',
      formTitle: 'Login to your account',
      userOptions: [
        {
          type: 'client',
          title: 'Member'
        },
        {
          type: 'admin',
          title: 'Administrators'
        }
      ],
      accTypes: [
        {
          value: 'email',
          faIcon: 'fas fa-envelope',
          matIcon: 'email',
          title: 'Email'
        },
        {
          value: 'phone',
          faIcon: 'fas fa-phone-alt',
          matIcon: 'phone',
          title: 'Phone number'
        },
        {
          value: 'userName',
          faIcon: 'fas fa-user',
          matIcon: 'person',
          title: 'User name'
        }
      ],
      username: {
        label: 'Username',
        placeholder: 'Enter your username!'
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password!'
      },
      login: 'Sign in',
      forgotPass: 'Forgot password?',
      or: 'Or',
      signInWith: 'Sign in with',
      signUp: {
        label: 'Do not have an account?',
        suggestions: 'Sign up'
      },
      loginSuccess: 'Logged in successfully!'
    }
  ];
  data: any = {};

  formData: any;

  userOptions: any;

  localhost: number;

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private appService: AppService,
    private socketioService: SocketioService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private snackbarService: SnackbarService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitSiteValues) {
        if (appService.origin) {
          this.localhost = appService.origin.indexOf('localhost');
        }
      }
    });

    if (isPlatformBrowser(platformId)) {
      this.isBrowser = true;
    }
  }

  ngOnInit(): void {
    this.getLangData();
    const formData: any = {};
    formData.accType = this.data.accTypes[0];
    formData.option = 'client';
    this.formData = formData;
    this.getUserOption(this.formData.option);
  }

  getLangData() {
    this.data = this.languageService.getLangContent(this.langsData, this.lang);
    this.langData = this.languageService.getLangData(this.lang);
  }

  getUserOption(type) {
    if (this.appService.userOptions) {
      this.userOptions = this.appService.userOptions.find(item => item.type === type);
      this.getForgotPassLink(this.formData.username);
    }
  }

  getUsername($event) {
    if ($event) {
      if (this.formData.accType.value === 'phone') {
        this.formData.username = $event.code + '' + $event.number;
      } else {
        this.formData.username = $event;
      }
    } else {
      this.formData.username = null;
    }
    this.getForgotPassLink(this.formData.username);
  }

  getForgotPassLink(username) {
    if (this.userOptions) {
      this.userOptions.forgotPassLink = this.userOptions.forgotPass;
      if (username) {
        this.userOptions.forgotPassLink = this.userOptions.forgotPass + '?username=' + username;
      }
    }
  }

  login(formData) {
    if (formData.option === 'client') {
      this.memberLogin(formData);
    } else {
      if (isNaN(formData.username)) {
        const index = formData.username.indexOf('@');
        if (index === -1) {
          formData.userLevel = 'admins';
        } else {
          formData.userLevel = 'users';
        }
      } else {
        formData.userLevel = 'users';
      }
      this.userLogin(formData);
    }
  }

  memberLogin(formData) {
    const data = {
      username: formData.username,
      password: formData.password
    }
    this.appService.memberLogin(data).subscribe(res => {
      if (res.mess === 'ok') {
        formData.loginFail = null;
        const clientData = {
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
          status: res.status,
          login_code: res.login_code
        }
        this.emitLogin(clientData);
      } else {
        formData.loginFail = this.langData.loginResults.find(item => item.status === res.mess);
        console.log({ err: res.err, time: new Date() });
      }
    }, err => {
      formData.loginFail = this.langData.loginResults.find(item => item.status === 'fail');
      console.log({ err: err, time: new Date() });
    });
  }

  userLogin(formData) {
    const dataPost = {
      username: formData.username,
      password: formData.password,
      userLevel: formData.userLevel
    }
    this.appService.userLogin(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        const e = res.userData;
        e.provider = 'admin';

        const ADMINS = this.appService.isArray(e.webAdmins).data;
        var webAdmin: any;
        if (e.userLevel === 'admins') {
          if (e.level === 'admin') {
            webAdmin = true;
          } else {
            webAdmin = ADMINS.find(item => item === this.appService.domain);
          }
        } else {
          if (e.agency_code === this.appService.agency_code) {
            // webAdmin = ADMINS.find(item => item === this.appService.domain);
            webAdmin = true;
          } else {
            webAdmin = false;
          }
        }

        if (!webAdmin) {
          formData.loginFail = {
            note: this.langData.noAdminPermission
          };
        } else {
          formData.loginFail = null;
          this.emitLogin(e);
        }
      } else {
        formData.loginFail = this.langData.loginResults.find(item => item.status === res.mess);
        console.log({ err: res.err, time: new Date() });
      }
    }, err => {
      formData.loginFail = this.langData.loginResults.find(item => item.status === 'fail');
      console.log({ err: err, time: new Date() });
    });
  }

  socialLogedin($event) {
    if ($event) {
      const user = {
        username: $event.provider + '_' + $event.email,
        nickname: $event.name,
        fullname: $event.name,
        avatar: {
          type: 'href',
          value: $event.photoUrl
        },
        avatarLink: $event.photoUrl,
        emails: [ $event.email ],
        tels: [],
        agency_code: $event.provider,
        userLevel: 'socials',
        provider: $event.provider
      }
      this.emitLogin(user);
    }
  }

  emitLogin(user) {
    const isLoged = {
      status: true,
      username: user.username,
      login_code: user.login_code,
      userLevel: user.userLevel
    }
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem('isLoged', JSON.stringify(isLoged));
    }
    const userData = this.appService.setUserData(user);

    const emitData = {
      message: this.socketioService.messages.emitLoginData + '_' + this.appService.domain,
      emit: false,
      broadcast: true,
      content: {
        userData: userData
      }
    }
    this.socketioService.emit("client_emit", emitData);

    this.messageService.sendMessage(this.messageService.messages.sendUserData, userData);

    this.snackbarService.openSnackBar({ message: this.data.loginSuccess });
  }

  signUp() {
    const moduleRoutes = this.appService.getModuleRoute(this.lang)
    const route = '/' + this.lang + '/' + moduleRoutes.userAccount + '/' + moduleRoutes.signUp;
    this.router.navigate([route]);
    this.closeForm();
  }

  closeForm() {
    this.close.emit();
  }

}
