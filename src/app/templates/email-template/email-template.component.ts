import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit, OnDestroy {
  
  subscription: Subscription;

  @Input() lang!: string;
  @Input() data: any;
  @Input() label!: boolean;
  @Input() appearance: any;
  @Input() floatLabel: any;
  @Input() required: any;
  @Input() matError: any;

  @Output() emitData = new EventEmitter();

  langsData: any = [
    {
      lang: 'vi',
      label: 'Email',
      placeholder: 'Địa chỉ Email!',
      notValid: 'Email không hợp lệ',
      missingAt: 'Email phải có @',
      plsValid: 'Hãy nhập Email hợp lệ!'
    },
    {
      lang: 'en',
      label: 'Email',
      placeholder: 'Email address!',
      notValid: 'Invalid email',
      missingAt: 'Email must include @',
      plsValid: 'Please enter a valid email!'
    }
  ];
  langContent: any = {};

  email!: string;

  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getlangData();
      }
    });
  }

  ngOnInit(): void {
    this.getlangData();

    if (this.data) {
      this.email = this.data.mail;
    }
  }

  getlangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  checkEmail(email: string) {
    if (email) {
      if (email.indexOf('@') !== -1) {
        const arr = email.split('@');
        if (arr.length === 2) {
          if (arr[0] === '') {
            this.matError = this.langContent.notValid;
          } else {
            const domain = arr[1];
            if (domain.indexOf('.') !== -1) {
              const domainArr = domain.split('.');
              if (domainArr.length < 4) {
                if (domainArr.length === 3) {
                  if (domainArr[0] === '' || domainArr[1] === '' || domainArr[2] === '') {
                    this.matError = this.langContent.plsValid;
                  } else {
                    this.matError = null;
                  }
                } else {
                  if (domainArr[0] === '' || domainArr[1] === '') {
                    this.matError = this.langContent.plsValid;
                  } else {
                    this.matError = null;
                  }
                }
              } else {
                this.matError = this.langContent.plsValid;
              }
            } else {
              this.matError = this.langContent.plsValid;
            }
          }
        } else {
          this.matError = this.langContent.plsValid;
        }
      } else {
        this.matError = this.langContent.plsValid;
      }

      if (this.matError) {
        this.emitData.emit(null);
      } else {
        this.emitData.emit(email);
      }
    } else {
      this.emitData.emit(null);
      this.matError = null;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
