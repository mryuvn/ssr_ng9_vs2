import { Component, Inject, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { LanguageService } from 'src/app/services/language.service';
import { AppService } from 'src/app/services/app.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @Input() title!: string;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  
  openDialog(data: any) {
    const dialogRef = this.dialog.open(SignUpFormComponent, { data: data });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpFormComponent implements OnDestroy {

  subscription: Subscription;

  lang!: string;
  langsData: any = [
    {
      lang: 'vi',
      formTitle: 'Đăng ký tài khoản',
      cancel: 'Hủy',
      submit: 'Đăng ký',
      nickname: {
        label: 'Biệt danh',
        placeholder: 'Nhập biệt danh của bạn!'
      },
      fullname: {
        label: 'Họ tên',
        placeholder: 'Nhập họ tên đầy đủ của bạn!'
      },
      password: {
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu của bạn!'
      },
      rePassword: {
        label: 'Nhập lại mật khẩu',
        placeholder: 'Nhập lại mật khẩu của bạn!',
        notMatch: 'Mật khẩu không khớp!'
      },
      passwordNote: 'Mật khẩu tối thiểu 6 ký tự, nên bao gồm cả chữ in hoa, số và ký tự đặc biệt.',
      showPass: 'Hiện mật khẩu',
      processing: 'Đang khởi tạo tài khoản của bạn',
      done: {
        title: 'Khởi tạo tài khoản thành công!',
        message: 'Cảm ơn bạn đã đăng ký tài khoản tại ' + this.appService.domain + '! Hãy kiểm tra địa chỉ Email để lấy Mật khẩu đăng nhập! (Nếu không tìm thấy trong hộp thư đến, hãy thử kiểm tra trong mục SPAM)',
        welcome: 'Chào mừng bạn đến với ' + this.appService.domain + '! Bây giờ bạn đã có thể đăng nhập và trải nghiệm những tiện ích của chúng tôi.'
      },
      fail: {
        title: 'Khởi tạo thất bại',
        message: 'Có lỗi xảy ra, xin vui lòng thử lại sau!'
      },
      mailSubject: 'Khởi tạo tài khoản tại',
      mailContent: {
        message: 'Cảm ơn bạn đã đăng ký tài khoản với',
        password: 'Mật khẩu đăng nhập của bạn là'
      }
    },
    {
      lang: 'en',
      formTitle: 'Register your account',
      cancel: 'Cancel',
      submit: 'Register',
      nickname: {
        label: 'Nickname',
        placeholder: 'Enter your nickname!'
      },
      fullname: {
        label: 'Fullname',
        placeholder: 'Enter your fullname!'
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password!'
      },
      rePassword: {
        label: 'Retype password',
        placeholder: 'Retype your password!',
        notMatch: 'Password does not match!'
      },
      passwordNote: 'Password must be at least 6 characters, should include uppercase letters, numbers and special characters.',
      showPass: 'Show password',
      processing: 'Creating your account',
      done: {
        title: 'Your account has been created!',
        message: 'Thanks for signing up at ' + this.appService.domain + '! Please check your Email to get your login Password! (If there is not our email in your inbox, you can check it at SPAM.)',
        welcome: 'We welcome you! Now you can log in and enjoy our services.'
      },
      fail: {
        title: 'Processing fail!',
        message: 'Something went wrong, please try again later!'
      },
      mailSubject: 'Create your account at',
      mailContent: {
        message: 'Thanks for sign up with',
        password: 'Your login password is'
      }
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
      ],
      disabled: true
    }
  ];

  formData: any;
  processData: any;
  processing!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SignUpFormComponent>,
    private appService: AppService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private socketioService: SocketioService
  ) {
    this.lang = appService.sitelang;
    this.getLangData();
    this.setFormData();

    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getLangData();
      }
    });
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.accTypes.forEach((item: any) => {
      item.titleValue = this.languageService.getLangValue(item.title, this.lang);
    });
  }

  setFormData() {
    let e: any = {};
    e.username = this.data.accType.value !== 'userName' ? this.data.username : '';
    e.phoneNumber = this.data.phoneNumber;

    const accTypeValue = this.data.accType.value === 'phone' ? 'phone' : 'email';
    const accType = this.accTypes.find((item: any) => item.value === accTypeValue);
    e.accType = accType ? accType : {};
    this.formData = e;
  }

  getPhoneNumber($event: any) {
    if ($event) {
      this.formData.phoneNumber = $event;
      const code = $event.code.replace(/[+]+/g, "");
      const number = $event.number.replace("0", "");
      this.formData.username = code + number;
    }
  }

  checkRePassword(formData: any) {
    if (formData.rePassword && formData.rePassword !== formData.password) {
      formData.passwordNotMatch = this.langContent.rePassword.notMatch;
    } else {
      formData.passwordNotMatch = null;
    }
  }

  submit(formData: any) {
    if (!this.processing) {
      this.processing = true;
      this.processData = {
        processing: true,
        status: this.langContent.processing
      }
  
      const userData = {
        username: formData.username,
        nickname: formData.nickname,
        fullname: formData.fullname,
        password: formData.password,
        accType: formData.accType.value,
        phoneNumber: formData.phoneNumber
      }
      const logErr = (err: any) => this.appService.logErr(err, 'submit()', 'SignUpFormComponent');
      this.appService.clientSignUp(userData).subscribe(res => {
        if (res.mess === 'ok') {
          formData.newUser = res.data;
          formData.newUser.userLevel = 'clients';
          
          //Không gửi Email/SMS khi cho phép tạo Mật khẩu từ đầu
          const newPassword = res.newPassword;
          if (formData.accType.value === 'email') {
            // this.sendMail(formData.username, newPassword);
          } else {
            //Send SMS
          }

          setTimeout(() => {
            this.processData = {
              status: this.langContent.done.title,
              message: this.langContent.done.welcome,
              okBtn: true
            }
          }, 1000);
        } else {
          logErr(res.err);
          setTimeout(() => {
            this.processData = {
              status: this.langContent.fail.title,
              err: res.err
            }
          }, 1000);
        }
      }, err => {
        logErr(err);
        setTimeout(() => {
          this.processData = {
            status: this.langContent.fail.title,
            err: err
          }
        }, 1000);
      });
    }
  }

  login(userData: any) { //Do not use
    // console.log(userData);
    userData.userLevel = 'client';
    this.appService.setUserData(userData);
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

  sendMail(email: string, newPassword: string) {
    console.log(email);
    const mailAdmin = null; //API will provide default email
    const mailTo = email;
    const time = new Date();
    const mailSubject = '[' + this.langContent.mailSubject + ' www.' + this.appService.domain + '] = ' + time.toString();

    const message = `
      Ghi chú: Đây là Email thông báo nhận tin tức từ trang web www.` + this.appService.domain + `; Không phải Spam.
      <br /> <em>(Note: This is notification email from website www.` + this.appService.domain + `; Not Spam.)</em>
    `;

    const mailContent = `
      <p>` + this.langContent.mailContent.message + ` ` + this.appService.domain + `!</p>
      <p>` + this.langContent.mailContent.password + ` <b>` + newPassword + `</b></p>
      <em>Time: ` + time.toString() + `</em><br />
      <p>-----</p>` + message;

    const mailData = {
      acc: mailAdmin,
      data: {
        email: mailTo,
        subject: mailSubject,
        content: mailContent
      }
    };
    // console.log(mailData);

    this.appService.sendMail(mailData).subscribe(res => {
      if (res.mess === 'fail') {
        this.appService.logErr(res.err, 'sendMail()', 'SignUpFormComponent');
      } else {
        console.log('Email has been sent to Email: ' + mailTo);
      }
      // this.processDone();
    }, err => {
      this.appService.logErr(err, 'sendMail()', 'SignUpFormComponent');
      // this.processDone();
    });
  }

  close() {
    if (this.formData.newUser) {
      // this.login(this.formData.newUser);
      this.messageService.sendMessage(this.socketioService.messages.user.clientSignUp, this.formData.newUser);

      const dataEmit = {
        message: this.socketioService.messages.user.clientSignUp + '_' + this.appService.domain,
        emit: false,
        broadcast: true,
        content: {
          newUser: this.formData.newUser
        }
      }
      this.socketioService.emit('client_emit', dataEmit);
    }

    setTimeout(() => {
      this.dialogRef.close();
    }, 1);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
