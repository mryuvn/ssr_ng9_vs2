import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-client-sign-up',
  templateUrl: './client-sign-up.component.html',
  styleUrls: ['./client-sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClientSignUpComponent implements OnInit, OnDestroy {

  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() noSubmit: boolean;
  @Input() autoLogin: boolean;

  @Input() email: string;
  @Input() phoneNumber: any;

  @Output() emitData = new EventEmitter();

  myObserve: any;

  lang: string;
  langData: any = {};
  langsData: any = [
    {
      lang: 'vi',
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
        }
      ],
      username: {
        label: 'Người dùng',
        exists: 'Username này đã tồn tại!',
        checkErr: 'Có lỗi xảy ra, không kiểm tra được username!'
      },
      password: {
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu của bạn!',
        minLegth: 'Mật khẩu phải tối thiểu'
      },
      rePassword: {
        label: 'Xác nhận mật khẩu',
        placeholder: 'Nhập lại mật khẩu!',
        notMatch: 'Mật khẩu không khớp'
      },
      characters: 'Ký tự',
      submit: 'Tạo tài khoản',
      success: 'Tạo tài khoản thành công!',
      fail: 'Không tạo được tài khoản của bạn!',
      signIn: 'Đăng nhập',
      retry: 'Thử lại'
    },
    {
      lang: 'en',
      accTypes: [
        {
          value: 'email',
          faIcon: 'fas fa-envelope',
          matIcon: 'email',
          title: 'Email address'
        },
        {
          value: 'phone',
          faIcon: 'fas fa-phone-alt',
          matIcon: 'phone',
          title: 'Phone number'
        }
      ],
      username: {
        label: 'Username',
        exists: 'This username already exists!',
        checkErr: 'Something went wrong, can not check this username!'
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password!',
        minLegth: 'Password must be at least'
      },
      rePassword: {
        label: 'Confirm password',
        placeholder: 'ReRetype password!',
        notMatch: 'Password does not match'
      },
      characters: 'Characters',
      submit: 'Create account',
      success: 'Tạo tài khoản thành công!',
      fail: 'Không tạo được tài khoản của bạn!',
      signIn: 'Đăng nhập',
      retry: 'Retry'
    }
  ];
  data: any = {};

  formData: any;
  passwordMinlength: number = 6;

  process: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService,
    private socketioService: SocketioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.getLangData();

    this.setFormData();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
        }
      }
    });
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.data = this.languageService.getLangContent(this.langsData, this.lang);
  }

  setFormData() {
    const formData: any = {};
    formData.email = this.email;
    formData.phoneNumber = this.phoneNumber;

    formData.accType = this.data.accTypes[0];
    formData.username = formData.email;

    this.formData = formData;
    this.checkUsername();
  }

  checkUsername() {
    if (this.formData.username) {
      this.appService.getMembers(this.formData.username).subscribe(res => {
        if (res.mess === 'ok') {
          if (res.data.length > 0) {
            this.formData.usernameErr = {
              mess: this.data.username.exists
            }
            setTimeout(() => {
              this.emitFormData();
            }, 1);
          } else {
            this.formData.usernameErr = null;
            setTimeout(() => {
              this.emitFormData();
            }, 1);
          }
        } else {
          console.log({ res: res, time: new Date() });
          this.formData.usernameErr = {
            mess: this.data.username.checkErr,
            err: res.err
          };
          setTimeout(() => {
            this.emitFormData();
          }, 1);
        }
      }, err => {
        console.log({ err: err, time: new Date() });
        this.formData.usernameErr = {
          mess: this.data.username.checkErr,
          err: err
        };
        setTimeout(() => {
          this.emitFormData();
        }, 1);
      });
    }
  }

  getUsername() {
    if (this.formData.accType.value === 'email') {
      this.formData.username = this.formData.email;
    } else {
      this.formData.username = this.formData.phoneNumber;
      if (this.formData.phoneNumber) {
        this.formData.username = this.formData.phoneNumber.code + '' + this.formData.phoneNumber.number;
      } else {
        this.formData.username = null;
      }
    }
    if (this.formData.username) {
      this.checkUsername();
    } else {
      this.formData.usernameErr = null;
      this.emitFormData();
    }
  }

  checkPassword() {
    if (this.formData.password) {
      if (this.formData.password.length < this.passwordMinlength) {
        this.formData.passwordInvalid = this.data.password.minLegth + ' ' + this.passwordMinlength + ' ' + this.data.characters;
      } else {
        this.formData.passwordInvalid = null;
        if (this.formData.rePassword) {
          if (this.formData.rePassword !== this.formData.password) {
            this.formData.passwordNotMatch = this.data.rePassword.notMatch + '!';
          } else {
            this.formData.passwordNotMatch = null;
          }
        }
      }
    } else {
      this.formData.passwordInvalid = null;
    }
    this.emitFormData();
  }

  submit(formData) {
    if (!this.noSubmit && !this.process) {
      this.process = {};
      this.process.loading = true;
      // return false;

      this.appService.createMember(formData).then(res => {
        if (res.mess === 'ok') {
          setTimeout(() => {
            this.process.loading = false;
            this.process.title = this.data.success;
            if (!this.autoLogin) {
              this.process.done = true;
            }
          }, 500);
          const newMember = res.memberData;
          newMember.id = res.id;
          newMember.enabled = 1;
          const emitData = {
            message: this.socketioService.messages.userActions.addMember,
            emit: false,
            broadcast: true,
            content: {
              newData: newMember,
              database: res.database
            }
          }
          this.socketioService.emit("client_emit", emitData);
          if (this.autoLogin) {
            this.signIn(formData);
          }
        } else {
          console.log({ res: res, time: new Date() });
          setTimeout(() => {
            this.process.loading = false;
            this.process.title = this.data.fail;
            this.process.err = this.langData.processErr;
          }, 500);
        }
      }).catch(err => {
        console.log({ err: err, time: new Date() });
        setTimeout(() => {
          this.process.loading = false;
          this.process.title = this.data.fail;
          this.process.err = this.langData.processErr;
        }, 500);
      });
    }
  }

  emitFormData() {
    if ( this.noSubmit 
      && this.formData.username 
      && this.formData.password 
      && this.formData.rePassword 
      && !this.formData.passwordInvalid 
      && !this.formData.passwordNotMatch
      && !this.formData.usernameErr) {
        const data = {
          username: this.formData.username,
          password: this.formData.password
        }
        this.emitData.emit(data);
    } else {
      this.emitData.emit(null);
    }
  }

  signIn(formData) {
    const data = {
      username: formData.username,
      password: formData.password
    }
    this.appService.clientLogin(data).subscribe(res => {
      if (res.mess === 'ok') {
        formData.loginError = null;

        const isLoged = {
          status: true,
          username: res.username,
          login_code: res.login_code,
          userLevel: 'members'
        }
        if (typeof (Storage) !== "undefined") {
          localStorage.setItem('isLoged', JSON.stringify(isLoged));
        }

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
          status: res.status
        }

        const userData = this.appService.setUserData(clientData);

        const emitData = {
          message: this.socketioService.messages.emitLoginData + '_' + this.appService.domain,
          emit: false,
          broadcast: true,
          content: {
            userData: userData
          }
        }
        this.socketioService.emit("client_emit", emitData);

        setTimeout(() => {
          this.messageService.sendMessage(this.messageService.messages.sendUserData, userData);
          const route = '/' + this.lang + '/' + this.appService.getModuleRoute(this.lang);
          this.router.navigate([route]);
        }, 500);
      } else {
        console.log({ res: res, time: new Date() });
        setTimeout(() => {
          formData.loginError = this.langData.loginResults.find(item => item.status === res.mess);
        }, 500);
      }
    }, err => {
      console.log({ err: err, time: new Date() });
      setTimeout(() => {
        formData.loginError = this.langData.loginResults.find(item => item.status === 'fail');
      }, 500);
    });
  }

  ngOnDestroy(): void {
    if (this.myObserve) {
      this.myObserve.unsubscribe();
    }
  }

}
