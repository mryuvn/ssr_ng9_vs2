import { Component, Inject, PLATFORM_ID, OnInit, Input, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {

  @Input() siteValues: any;
  
  subscription: Subscription;
  socket: any;
  myObserve: any;
  
  lang: string;
  langData: any = {};
  langsData: any = [
    {
      lang: 'vi',
      formTitle: 'Đăng ký',
      formCaption: 'Hỗ trợ trực tiếp từ nhóm Admin',
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
        label: 'Loại dịch vụ',
        placeholder: 'Chọn loại dịch vụ!',
        other: 'Vấn đề khác'
      },
      content: {
        label: 'Nội dung',
        placeholder: 'Nhập nội dung yêu cầu!'
      },
      processData: {
        processing: 'Đang gửi yêu cầu của bạn...',
        err: 'Có lỗi xảy ra, xin vui lòng thử lại sau!',
        done: 'Gửi yêu cầu thành công!',
        notif: 'Thông tin liên hệ của bạn đã được gửi đến bộ phận tư vấn của chúng tôi. Chúng tôi sẽ phản hồi nhanh nhất có thể.',
        thank: 'Xin cảm ơn!'
      }
    },
    {
      lang: 'en',
      formTitle: 'Register',
      formCaption: 'Support from Admin',
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
        label: 'Category',
        placeholder: 'Select a service!',
        other: 'Other issues'
      },
      content: {
        label: 'Request',
        placeholder: 'Enter your request!'
      },
      processData: {
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
  formData: any = { locationCountry: 'VN' };
  locationStr: string;

  uploadPath: string;
  alias: string = 'contact_form';
  data: any = {};
  dataConfig: any = {};

  mailSystem = {
    admin: 'admin',
    receive: 'webMail'
  }
  webMail: string;
  mainAdmin: any;

  processData: any;

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      //
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;

      const messages = {
        new: socketioService.messages.simplePage.new + '_' + appService.domain,
        edit: socketioService.messages.simplePage.edit + '_' + appService.domain,
        delete: socketioService.messages.simplePage.delete + '_' + appService.domain,
        updateContents: socketioService.messages.simplePage.updateContents + '_' + appService.domain
      }

      this.socket = socketioService.on(messages.new).subscribe(content => {
        if (content) {
          const e = content.newData;
          if (e.alias === this.alias && e.lang === this.lang && !this.data.id) {
            this.renderData(e);
          }
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.edit).subscribe(content => {
        var arr = content.dataArr;
        if (!arr) {
          arr = [ content.data ];
        }
        const e = arr.find(item => item.id === this.data.id || item.alias === this.alias && item.lang === this.lang);
        if (e) {
          this.getData();
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = socketioService.on(messages.delete).subscribe(content => {
        var arr = content.dataArr;
        if (!arr) {
          arr = [ content.data ];
        }
        const index = arr.findIndex(item => item.id === this.data.id);
        if (index !== -1) {
          this.getData();
        }
      });
    }
  }

  ngOnInit(): void {
    this.table = this.appService.tables.contacts;
    this.uploadPath = this.appService.uploadPaths.pages;
    this.lang = this.route.snapshot.params.lang;
    if (this.lang) {
      this.getLangData();
      this.getData();
    } else {
      console.log('No language selected!');
    }

    if (this.siteValues.emailArr) {
      const webMail = this.siteValues.emailArr.find(item => item.alias === this.mailSystem.receive);
      if (webMail) {
        this.webMail = webMail.value;
      }
    }

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        var lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
          this.getData();
        }
      }
    });
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  getData() {
    this.appService.getSqlData({
      table: this.appService.tables.simplePages.list,
      where: 'WHERE alias = "' + this.alias + '" AND lang = "' + this.lang + '" AND enabled = 1'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        if (res.data.length > 0) {
          this.renderData(res.data[0]);
        } else {
          this.data.err = 'No data!';
          console.log('Page alias = ' + this.alias + ' does not exist!');
        }
      } else {
        this.data.err = res.err;
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.data.err = err;
      console.log({ err: err, time: new Date() });
    });
  }

  renderData(e) {
    this.appService.renderPageData(e, this.uploadPath);
    this.data = e;
    if (this.data.JSON) {
      this.dataConfig = this.data.JSON;
    }
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

  submit(formData) {
    this.processData = {}
    this.processData.processing = true;
    this.processData.mess = this.langContent.processData.processing;

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
          this.processData = {
            mess: this.langContent.processData.done,
            notif: this.langContent.processData.notif
          }
        }, 500);
      } else {
        console.log({ res: res, time: new Date() });
        setTimeout(() => {
          this.processData = {
            mess: this.langContent.processData.err,
            err: res.err
          }
        }, 1500);
      }
    }, err => {
      console.log({ err: err, time: new Date() });
      setTimeout(() => {
        this.processData = {
          mess: this.langContent.processData.err,
          err: err
        }
      }, 1500);
    });
  }

  sendMail(newData) {
    if (this.siteValues) {
      var mailAdmin = this.mainAdmin;
      var mailTo = this.webMail;
      if (!mailTo) {
        mailTo = 'mryu.vn@gmail.com';
      }

      var subject = '';
      if (newData.subject) {
        subject = ' - ' + newData.subject;
      } else if (newData.content) {
        subject = ' - ' + newData.content.substring(0, 9) + '...';
      } else {
        subject = '';
      }
  
      const mailSubject = '[Liên hệ từ ' + this.appService.domain + '] ' + newData.name + ' - ' + subject;
      
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

  resetForm() {
    this.formData = null;
    setTimeout(() => {
      this.formData = {};
    }, 1);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
