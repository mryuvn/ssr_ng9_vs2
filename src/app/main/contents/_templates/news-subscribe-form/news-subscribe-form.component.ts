import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-news-subscribe-form',
  templateUrl: './news-subscribe-form.component.html',
  styleUrls: ['./news-subscribe-form.component.scss']
})
export class NewsSubscribeFormComponent implements OnInit, OnDestroy {

  @Input() lang: any;
  @Input() bgColor: string;

  subscription: Subscription;
  socket: any;

  uploadPath: string;
  alias: string = 'news_subscribe';
  data: any = {};
  dataConfig: any = {};
  
  table: string;
  formData: any = {};

  langData: any = {};
  langsData: any = [
    {
      lang: 'vi',
      mailPlaceholder: 'Nhập Email của bạn!',
      checkbox: 'Đồng ý nhận các thông tin mới từ chúng tôi',
      button: 'Gửi',
      emailExisted: 'Email này đã được đăng ký!'
    },
    {
      lang: 'en',
      mailPlaceholder: 'Enter your Email!',
      button: 'Send',
      checkbox: 'Agree to receive our news & information',
      emailExisted: 'This email has been registered!'
    }
  ];
  langContent: any = {};

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private snackbarService: SnackbarService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data.lang;
        this.getLangData();
        this.getData();
      }
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
    this.table = this.appService.tables.newsSubscribe;
    this.uploadPath = this.appService.uploadPaths.pages;
    if (this.lang) {
      this.getLangData();
      this.getData();
    } else {
      console.log('No language selected!');
    }
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
          // console.log('Page alias = ' + this.alias + ' does not exist!');
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

    if (!this.dataConfig.mailPlaceholder) {
      this.dataConfig.mailPlaceholder = this.langContent.mailPlaceholder;
    }
    if (!this.dataConfig.checkbox) {
      this.dataConfig.checkbox = this.langContent.checkbox;
    }
    if (!this.dataConfig.button) {
      this.dataConfig.button = this.langContent.button;
    }
  }

  checkEmail(email) {
    const rs = this.appService.checkEmail(email);
    if (rs) {
      if (rs.mess === 'fail') {
        const emailInvalid = rs.content.find(item => item.lang === this.lang);
        if (emailInvalid) {
          return emailInvalid.value;
        }
        return null;
      }
      return null;
    }
    return null;
  }

  process: any = {};
  submit(formData) {
    if (!this.process.loading) {
      this.process.loading = true;
      this.process.err = this.checkEmail(formData.email);
      if (this.process.err) {
        setTimeout(() => {
          this.process.loading = false;
        }, 1000);
      } else {
          this.appService.getSqlData({
            table: this.table,
            where: 'WHERE email = "' + formData.email + '"'
          }).subscribe(res => {
            if (res.mess === 'ok') {
              if (res.data.length === 0) {
                this.addData(formData);
              } else {
                setTimeout(() => {
                  this.process.err = this.langContent.emailExisted;
                  this.process.loading = false;
                }, 1000);
              }
            } else {
              console.log({ res: res, time: new Date() });
              setTimeout(() => {
                console.log(this.langData);
                this.process.err = this.langData.processErr;
                this.process.loading = false;
              }, 1000);
            }
          }, err => {
            console.log({ err: err, time: new Date() });
            setTimeout(() => {
              this.process.err = this.langData.processErr;
              this.process.loading = false;
            }, 1000);
          });
      }
    }
  }

  addData(formData) {
    const dataPost = {
      table: this.table,
      fields: {
        email: formData.email,
        options: formData.options,
        createdTime: new Date()
      }
    }
    this.appService.addSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        const newData = res.data;
        newData.id = res.newId;
        newData.enabled = 1;
        const emitData = {
          message: this.socketioService.messages.newsSubscribe.new + '_' + this.appService.domain,
          emit: false,
          broadcast: true,
          content: {
            table: this.table,
            newData: newData
          }
        }
        this.socketioService.emit('client_emit', emitData);
        this.snackbarService.openSnackBar({ message: this.langData.processDone, horizon: 'right' });
        setTimeout(() => {
          this.process = {};
          this.formData = {};
        }, 1);
      } else {
        console.log({ res: res, time: new Date() });
        setTimeout(() => {
          this.process.err = this.langData.processErr;
          this.process.loading = false;
        }, 1000);
      }
    }, err => {
      console.log({ err: err, time: new Date() });
      setTimeout(() => {
        this.process.err = this.langData.processErr;
        this.process.loading = false;
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
