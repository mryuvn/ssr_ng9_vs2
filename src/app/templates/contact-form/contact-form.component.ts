import { Component, Inject, PLATFORM_ID, OnInit, Input, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() lang: string;
  @Input() dialog: boolean;
  @Input() btnOption: any;
  @Input() siteValues: any;

  subscription: Subscription;
  socket: any;

  langData: any = {};
  langsData: any = [
    {
      lang: 'vi',
      btnTitle: 'Liên hệ',
      formTitle: 'Gửi liên hệ của bạn',
      name: {
        label: 'Họ tên',
        placeholder: 'Bạn tên là gì?'
      },
      location: {
        label: 'Bạn đang ở đâu?',
        placeholder: 'Chọn Quốc gia hoặc Tỉnh/Thành!',
        requireMatchValue: 'Chọn theo danh sách!'
      },
      phone: {
        label: 'Số điện thoại',
        placeholder: 'Nhập số điện thoại của bạn!'
      },
      email: {
        label: 'Email',
        placeholder: 'Nhập Email của bạn!'
      },
      subject: {
        label: 'Tiêu đề',
        placeholder: 'Nhập tiêu đề!',
        other: 'Vấn đề khác'
      },
      content: {
        label: 'Nội dung',
        placeholder: 'Nhập nội dung yêu cầu!'
      },
      replyMethod: {
        label: 'Yêu cầu',
        options: [
          {
            value: 'callBack',
            title: 'Gọi lại'
          },
          {
            value: 'sendMail',
            title: 'Gửi mail'
          }
        ],
        callNotValid: 'Đề nghị gọi lại chỉ áp dụng trong Việt Nam!',
        phoneRequired: 'Nhập số điện thoại của bạn!',
        emailRequired: 'Nhập địa chỉ Email của bạn!'
      },
      process: {
        processing: 'Đang gửi yêu cầu của bạn...',
        err: 'Có lỗi xảy ra, xin vui lòng thử lại sau!',
        done: 'Gửi yêu cầu thành công!',
        notif: 'Thông tin liên hệ của bạn đã được gửi đến bộ phận tư vấn của chúng tôi. Chúng tôi sẽ phản hồi nhanh nhất có thể.',
        thank: 'Xin cảm ơn!'
      }
    },
    {
      lang: 'en',
      btnTitle: 'Contact us',
      formTitle: 'Send your contact',
      name: {
        label: 'Your name',
        placeholder: 'What is your name?'
      },
      location: {
        label: 'Where are you now?',
        placeholder: 'Select a country or City!',
        requireMatchValue: 'Select from the list!'
      },
      phone: {
        label: 'Phone number',
        placeholder: 'Enter your phone number!'
      },
      email: {
        label: 'Email',
        placeholder: 'Enter your email!'
      },
      subject: {
        label: 'Subject',
        placeholder: 'Enter Subject!',
        other: 'Other issues'
      },
      content: {
        label: 'Request',
        placeholder: 'Enter your request!'
      },
      replyMethod: {
        label: 'Request',
        options: [
          {
            value: 'callBack',
            title: 'Call back'
          },
          {
            value: 'sendMail',
            title: 'Send mail'
          }
        ],
        callNotValid: 'Call back is valid in Vietnam only!',
        phoneRequired: 'Please enter your phone number!',
        emailRequired: 'Please enter your email!'
      },
      process: {
        processing: 'Sending your data...',
        err: 'Something error, please try again later!',
        done: 'Request successfull!',
        notif: 'Your infomations has been sent to our consulting department. We will reply you ASAP.',
        thank: 'Thank you!'
      }
    }
  ];
  langContent: any = {};

  table: string;
  formData: any;
  locationStr: string;

  mailSystem = {
    admin: 'admin',
    receive: 'webMail'
  }
  webMail: string;
  mainAdmin: any;

  process: any;
  open: string;

  hostname: string;
  myRecaptcha = new FormControl();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data.lang;
        this.getLangContent();
      }
    });
  }

  ngOnInit(): void {
    this.table = this.appService.tables.contacts;

    this.getLangContent();

    this.hostname = this.appService.hostname;
    if (this.hostname === 'localhost') {
      this.myRecaptcha = new FormControl(true);
    }

    if (this.siteValues.emailArr) {
      const webMail = this.siteValues.emailArr.find(item => item.alias === this.mailSystem.receive);
      if (webMail) {
        this.webMail = webMail.value;
      }
    }

    if (!this.dialog) {
      this.formData = {
        locationCountry: 'VN'
      };
    }

    if (isPlatformBrowser(this.platformId)) {
      //
    }
  }

  getLangContent() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!')
  }

  onScriptError() {
    console.log('Something went wrong when loading the Google reCAPTCHA!')
  }

  openForm() {
    this.formData = {
      locationCountry: 'VN'
    };
    setTimeout(() => {
      this.open = 'open';
    }, 10);
  }

  selectLocation($event, phoneNumber) {
    if ($event) {
      this.formData.location = $event.value;
      this.formData.locationCountry = $event.code;
      phoneNumber.code = $event.countryData.dial_code;
      this.locationStr = $event.locationStr;
    } else {
      this.formData.location = null;
      this.formData.locationCountry = null;
      phoneNumber.code = '+84';
      this.locationStr = null;
    }
    phoneNumber.setMyControlValue(phoneNumber.code, false);
  }

  checkReplyMethod(option) {
    if (option === 'callBack') {
      this.formData.emailRequired = null;
      if (this.formData.tel) {
        if (this.formData.tel.code === '84') {
          this.formData.phoneRequired = null;
          this.formData.replyMethodFail = null;
        } else {
          this.formData.phoneRequired = null;
          this.formData.replyMethodFail = this.langContent.replyMethod.callNotValid;
        }
      } else {
        this.formData.phoneRequired = this.langContent.replyMethod.phoneRequired;
        this.formData.replyMethodFail = this.formData.phoneRequired;
      }
    } else if (option === 'sendMail') {
      this.formData.phoneRequired = null;
      if (this.formData.email) {
        this.formData.emailRequired = null;
        this.formData.replyMethodFail = null;
      } else {
        this.formData.emailRequired = this.langContent.replyMethod.emailRequired;
        this.formData.replyMethodFail = this.formData.emailRequired;
      }
    } else {
      this.formData.phoneRequired = null;
      this.formData.emailRequired = null;
      this.formData.replyMethodFail = null;
    }
  }

  submit(formData) {
    if (!this.process) {
      this.process = {}
      this.process.processing = true;
      this.process.mess = this.langContent.process.processing;
  
      var user = this.appService.userData.username;
      if (!user) {
        user = this.appService.clientUser;
      }
  
      const clientData = {
        ip: this.appService.geoIp.ip,
        userAgent: this.appService.userAgent,
        geoData: this.appService.geoIp.data
      }
  
      const dataPost = {
        table: this.table,
        fields: {
          name: formData.name,
          location: formData.location,
          tel: JSON.stringify(formData.tel),
          email: formData.email,
          subject: formData.subject,
          content: formData.content,
          replyMethod: formData.replyMethod,
          createdTime: new Date(),
          user: user,
          url: this.appService.domain + this.router.url,
          clientData: JSON.stringify(clientData)
        }
      }
      this.appService.addSqlData(dataPost).subscribe(res => {
        if (res.mess === 'ok') {
          const newData = res.data;
          newData.id = res.newId;
          const dataEmit = {
            message: this.socketioService.messages.webContact.new + '_' + this.appService.domain,
            emit: true,
            broadcast: true,
            content: {
              table: this.table,
              newData: newData
            }
          }
          this.socketioService.emit('client_emit', dataEmit);
  
          const notification = {
            message: this.socketioService.messages.appNotification + '_' + this.socketioService.messages.webContact.new,
            emit: false,
            broadcast: true,
            content: {
              domain: this.appService.domain,
              newData: newData
            }
          }
          this.socketioService.emit('client_emit', notification);
  
          this.sendMail(newData);
  
          setTimeout(() => {
            this.process = {
              mess: this.langContent.process.done,
              notif: this.langContent.process.notif
            }
          }, 500);
        } else {
          console.log({ res: res, time: new Date() });
          setTimeout(() => {
            this.process = {
              mess: this.langContent.process.err,
              err: res.err
            }
          }, 1500);
        }
      }, err => {
        console.log({ err: err, time: new Date() });
        setTimeout(() => {
          this.process = {
            mess: this.langContent.process.err,
            err: err
          }
        }, 1500);
      });
    }
  }

  sendMail(newData) {
    if (this.siteValues) {
      var mailAdmin = this.mainAdmin;
      var mailTo = this.webMail;
      if (!mailTo) {
        mailTo = 'legiang2016@gmail.com';
      }
  
      const mailSubject = '[Liên hệ từ ' + this.appService.domain + '] ' + newData.name + ' - ' + newData.subject;
      
      var phoneNumber = 'N/A';
      const phone = this.appService.isObject(newData.tel);
      if (phone.code && phone.number) {
        phoneNumber = '+' + phone.code + phone.number;
      }
  
      var email = 'N/A';
      if (newData.email) {
        email = newData.email;
      }
  
      var replyMethod = 'N/A';
      if (newData.replyMethod) {
        replyMethod = newData.replyMethod;
      }
  
      const mailContent = `
        <p>---</p>
        <p><b>Tiêu đề: ` + newData.subject + `</b></p>
        <em>(Vào lúc: ` + newData.createdTime + `)</em>
        <ul>
          <li>Người liên hệ: ` + newData.name + `</li>
          <li>Địa chỉ: ` + this.locationStr + `</li>
          <li>Số điện thoại: +` + phoneNumber + `</li>
          <li>Email: ` + email + `</li>
          <li>Nội dung: ` + newData.content + `</li>
          <li>Yêu cầu: ` + replyMethod + `</li>
          <li>Url: ` + newData.url + `</li>
        </ul>
        <p>---------</p>
        <em>Đây là email thông báo từ hệ thống quản trị doanh nghiệp. Không phải Spam.</em>
      `;
  
      const mailData = {
        acc: mailAdmin,
        data: {
          email: mailTo,
          subject: mailSubject,
          content: mailContent
        }
      }
      this.appService.sendMail(mailData).subscribe(res => {
        if (res.mess === 'fail') {
          console.log({ res: res, time: new Date() });
        }
      }, err => console.log({ err: err, time: new Date() }));
    } else {
      console.log('No siteValues!');
    }
  }

  closeForm() {
    this.open = null;
    setTimeout(() => {
      this.formData = null;
      this.process = null;
    }, 300);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
