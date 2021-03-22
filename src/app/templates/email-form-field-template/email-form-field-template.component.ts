import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-email-form-field-template',
  templateUrl: './email-form-field-template.component.html',
  styleUrls: ['./email-form-field-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailFormFieldTemplateComponent implements OnInit {

  @Input() lang: string;
  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() matLabel: string;
  @Input() placeholder: string;
  @Input() matSuffix: string;
  @Input() required: any;
  @Input() mailData: any;
  @Input() dataSource: any;
  @Input() indexItem: any;

  @Output() emitData = new EventEmitter();

  subscription: Subscription;

  langsData: any = [
    {
      lang: 'vi',
      matLabel: 'Email',
      placeholder: 'Nhập địa chỉ Email!',
      matError: 'Email không hợp lệ!',
      isExistence: 'Email đã tồn tại!'
    },
    {
      lang: 'en',
      matLabel: 'Email',
      placeholder: 'Enter Email address!',
      matError: 'Email is not valid!',
      isExistence: 'Email already exists!'
    }
  ];
  data: any = {};

  email: String;
  matError: String;
  isExistence: String;
  showErr: boolean;

  constructor(
    private messageService: MessageService,
    private appService: AppService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data.lang;
        this.getLangData();
      }
    })
  }

  ngOnInit() {
    this.getLangData();
    if (this.mailData) {
      this.email = this.mailData.mail;
    }
  }

  getLangData() {
    const rs = this.langsData.find(item => item.lang === this.lang);
    if (rs) {
      this.data = rs;
    } else {
      this.data = this.langsData[0];
    }
  }

  checkEmail(email) {
    if (email) {
      const rs = this.appService.checkEmail(email);
      if (rs.mess === 'fail') {
        const content = rs.content.find(item => item.lang === this.lang);
        if (content) {
          this.matError = content.value;
        } else {
          this.matError = this.data.matError;
        }
        this.emitData.emit(null);
      } else {
        this.matError = null;
        if (this.dataSource) {
          const rs = this.dataSource.find(item => item.mail === email);
          if (rs) {
            const index = this.dataSource.indexOf(rs);
            if (index !== this.indexItem) {
              this.isExistence = this.data.isExistence;
            } else {
              this.isExistence = null;
            }
          } else {
            this.isExistence = null;
          }

          if (this.isExistence) {
            this.emitData.emit(null);
          } else {
            this.emitData.emit(email);
          }
        } else {
          this.emitData.emit(email);
        }
      }
    } else {
      this.emitData.emit(null);
    }
  }

}
