import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Output() emitLogin = new EventEmitter();
  @Output() close = new EventEmitter();

  lang!: string;
  langsData: any = [
    {
      lang: 'vi',
      formTitle: 'Đăng nhập tài khoản',
      userOptions: [
        {
          type: 'client',
          title: 'Người dùng'
        },
        {
          type: 'admin',
          title: 'Quản trị viên'
        }
      ],
      password: 'Mật khẩu',
      login: 'Đăng nhập',
      forgotPass: 'Quên mật khẩu?',
      or: 'Hoặc',
      signInWith: 'Đăng nhập bằng',
      fbLogin: 'Đăng nhập bằng Facebook',
      ggLogin: 'Đăng nhập bằng Google',
      createAcc: 'Tạo tài khoản',
      signUp: {
        label: 'Bạn chưa có tài khoản?',
        suggestions: 'Tạo tài khoản'
      },
      notPermission: 'User không có quyền đăng nhập vào trang web này!'
    },
    {
      lang: 'en',
      formTitle: 'Login to your account',
      userOptions: [
        {
          type: 'client',
          title: 'Client'
        },
        {
          type: 'admin',
          title: 'Administrators'
        }
      ],
      password: 'Password',
      login: 'Sign in',
      forgotPass: 'Forgot password?',
      or: 'Or',
      signInWith: 'Sign in with',
      fbLogin: 'Sign in with Facebook',
      ggLogin: 'Sign in with Google',
      createAcc: 'Create account',
      signUp: {
        label: 'Do not have an account?',
        suggestions: 'Sign up'
      },
      notPermission: 'This user has not Permission!'
    }
  ];
  langContent: any = {};

  accTypes: any = [
    {
      value: 'email',
      faIcon: 'fas fa-envelope',
      matIcon: 'email',
      title: [
        {
          lang: 'vi',
          content: 'Email'
        }, {
          lang: 'en',
          title: 'Email'
        }
      ]
    },
    {
      value: 'phone',
      faIcon: 'fas fa-phone-alt',
      matIcon: 'phone',
      title: [
        {
          lang: 'vi',
          content: 'Điện thoại'
        }, {
          lang: 'en',
          content: 'Phone number'
        }
      ]
    },
    {
      value: 'userName',
      faIcon: 'fas fa-user',
      matIcon: 'person',
      title: [
        {
          lang: 'vi',
          content: 'Tên người dùng'
        }, {
          lang: 'en',
          content: 'User name'
        }
      ]
    }
  ];

  loginStatus: any = [
    {
      status: 'fail',
      title: [
        {
          lang: 'vi',
          content: 'Có lỗi xảu ra, xin vui lòng thử lại sau!'
        }, {
          lang: 'en',
          content: 'Something went wrong, please try again later!'
        }
      ]
    },
    {
      status: 'userNotFound',
      title: [
        {
          lang: 'vi',
          content: 'User này không tồn tại!'
        }, {
          lang: 'en',
          content: 'This user not exists!'
        }
      ]
    },
    {
      status: 'userDisabled',
      title: [
        {
          lang: 'vi',
          content: 'User này đã bị hủy!'
        }, {
          lang: 'en',
          content: 'This user is disabled!'
        }
      ]
    },
    {
      status: 'userLocked',
      title: [
        {
          lang: 'vi',
          content: 'User này đã bị khóa!'
        }, {
          lang: 'en',
          content: 'This user has been locked!'
        }
      ]
    },
    {
      status: 'wrongPassword',
      title: [
        {
          lang: 'vi',
          content: 'Mật khẩu không đúng!'
        }, {
          lang: 'en',
          content: 'Wrong password!'
        }
      ]
    },
    {
      status: 'userNotActive',
      title: [
        {
          lang: 'vi',
          content: 'User này chưa được kích hoạt'
        }, {
          lang: 'en',
          content: 'This user is not active!'
        }
      ]
    },
    {
      status: 'ok',
      title: [
        {
          lang: 'vi',
          content: 'Đăng nhập thành công!'
        }, {
          lang: 'en',
          content: 'Logged in successfully!'
        }
      ]
    }
  ];

  formData: any;

  isLogeds: any = [];

  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private snackbarService: SnackbarService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getLangData();
      }

      if (message.text === socketioService.messages.user.clientSignUp) {
        this.login(message.data);
      }
    });
  }

  ngOnInit(): void {
    this.lang = this.appService.sitelang;
    this.getLangData();
    this.setFormData();
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.accTypes.forEach((item: any) => {
      item.titleValue = this.languageService.getLangValue(item.title, this.lang);
    });
  }

  setFormData() {
    let e: any = {};
    e.userOption = 'client';
    const accTypeValue = e.userOption === 'admin' ? 'userName' : 'email';
    const accType = this.accTypes.find((item: any) => item.value === accTypeValue);
    e.accType = accType ? accType : {};

    this.formData = e;
    this.getIsLogeds();
  }

  getIsLogeds() {
    if (typeof (Storage) !== "undefined") {
      const isLogeds = this.appService.isArray(localStorage.getItem("isLogeds")).data;
      if (this.formData.userOption === 'client') {
        this.isLogeds = isLogeds.filter((item: any) => item.userLevel === 'clients');
      } else {
        this.isLogeds = isLogeds.filter((item: any) => item.userLevel === 'admins' || item.userLevel === 'users');
      }

      if (this.isLogeds.length > 0) {
        this.formData.username = this.isLogeds[0].username;
      } else {
        this.formData.username = '';
      }
    }
  }

  selectUserOption(formData: any) {
    this.getIsLogeds();
  }

  getPhoneNumber($event: any) {
    if ($event) {
      this.formData.phoneNumber = $event;
      const code = $event.code.replace(/[+]+/g, "");
      const number = $event.number.replace("0", "");
      this.formData.username = code + number;
    }
  }

  userLogin(formData: any) {
    const loginResult = (res: any) => {
      let result:any = this.loginStatus.find((item: any) => item.status === res.mess);
      if (result) { result.titleValue = this.languageService.getLangValue(result.title, this.lang) };
      if (res.mess === 'ok') {
        if (res.userData.userLevel === 'users') {
          if (res.userData.agency_code === this.appService.domainData.agency_code) {
            formData.loginErr = null;
            this.snackbarService.openSnackBar({ message: result?.titleValue });
            this.login(res.userData);
          } else {
            formData.loginErr = this.langContent.notPermission;
          }
        } else {
          formData.loginErr = null;
          this.snackbarService.openSnackBar({ message: result?.titleValue });
          this.login(res.userData);
        }
      } else {
        formData.loginErr = result.titleValue;
        if (res.mess === 'fail') {
          this.logErr(res.err, 'userLogin()');
        }
      }
    }
    
    if (formData.userOption === 'admin') {
      const userLevel = formData.accType.value === 'userName' ? 'admins' : 'users';
      const onStatus = formData.onStatus ? formData.onStatus : 'offline';
      const dataPost = {
        username: formData.username,
        password: formData.password,
        userLevel: userLevel,
        onStatus: onStatus
      }
      this.appService.userLogin(dataPost).subscribe(res => {
        loginResult(res);
      }, err => {
        loginResult({ mess: 'fail', err: err});
      });
    } else {
      //Client login here
      this.appService.getSqlData({
        table: this.appService.tables.members,
        where: 'WHERE username = "' + formData.username + '"'
      }).subscribe(res => {
        if (res.mess === 'ok') {
          let rs: any = {};
          if (res.data.length > 0) {
            let user = res.data[0];
            if (user.enabled) {
              const password = this.appService.md5(formData.password + user.username);
              if (password === user.password) {
                if (!user.userLevel) { user.userLevel = 'clients' };
                user.provider = user.userLevel;
                rs.mess = 'ok';
                rs.userData = user;
              } else {
                rs.mess = 'wrongPassword'
              }
            } else {
              rs.mess = 'userDisabled'
            }
          } else {
            rs.mess = 'userNotFound'
          }
          loginResult(rs);
        } else {
          loginResult(res);
        }
      }, err =>  loginResult({ mess: 'fail', err: err}));
    }
  }

  socialLogin($event: any) {
    // console.log($event);
    if ($event) {
      const user = {
        username: $event.provider + '_' + $event.email,
        fullname: $event.name,
        avatar: {
          type: 'href',
          value: $event.photoUrl
        },
        emails: [ $event.email ],
        tels: [],
        agency_code: $event.provider,
        userLevel: 'socials',
        provider: $event.provider
      }
      this.login(user);

      this.addUser(user);
    }
  }

  login(userData: any) {
    this.appService.setUserData(userData);
    this.emitLogin.emit(this.appService.userData);

    this.messageService.sendMessage(this.socketioService.messages.user.login, this.appService.userData.alias);

    const dataEmit = {
      message: this.socketioService.messages.user.login + '_' + this.appService.domain,
      emit: false,
      broadcast: true,
      content: {
        alias: this.appService.userData.alias
      }
    }
    this.socketioService.emit('client_emit', dataEmit);
  }

  addUser(user: any) {
    this.appService.getSqlData({
      table: this.appService.tables.members,
      fields: 'username, fullname, avatar',
      where: 'WHERE username = "' + user.username + '"'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        if (res.data.length === 0) {
          const userData = {
            username: user.username,
            fullname: user.fullname,
            nickname: '',
            avatar: JSON.stringify({
              type: user.avatar.type,
              value: user.avatar.value
            }),
            accType: 'email',
            userLevel: 'socials'
          }
          this.appService.clientSignUp(userData).subscribe(res => {
            if (res.mess === 'ok') {
              const newUser = res.data;
              this.appService.USERS.push(newUser);
              console.log('Created member for ' + user.username);
              console.log(newUser);
            } else {
              this.logErr(res.err, 'clientSignUp()');
            }
          }, err => this.logErr(err, 'clientSignUp()'));
        } else {
          // console.log('user ' + user.username + ' existed!');
          const e = res.data[0];
          e.avatar = this.appService.isObject(e.avatar).data;
          if (e.fullname !== user.fullname || e.avatar.value !== user.avatar.value) {
            this.appService.updateSocialUserData(user, e.username);
          } else {
            // console.log('No new data to update!');
          }
        }
      } else {
        this.logErr(res.err, 'getUser');
      }
    }, err => this.logErr(err, 'getUser'));
  }

  logErr(err: any, functionName: string) {
    this.appService.logErr(err, functionName, 'LoginComponent');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
