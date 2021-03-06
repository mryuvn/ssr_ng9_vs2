import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { LayoutService } from 'src/app/services/layout.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormDataComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() formID!: number;
  @Input() lang!: string;
  @Input() title!: boolean;
  @Input() bodyStyles!: boolean;

  commonData: any = {};
  langsData: any = [
    {
      lang: 'vi'
    },
    {
      lang: 'en'
    }
  ];
  langContent: any = {};

  formData: any;
  contactRequired!: string;
  processData: any;
  processing!: boolean;
  resetForm: boolean = false;

  url!: string;
  isBrowser!: boolean;

  constructor(
    private router: Router,
    private appService: AppService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private layoutService: LayoutService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getLangData();
        this.setFormContent();
      }
    });
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this.isBrowser = this.appService.isBrowser;
    this.getLangData();

    if (this.formID) {
      this.getForms();
    } else {
      console.log('No form ID!');
    }
  }

  getLangData() {
    this.commonData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  setFormContent() {
    const getValue = (data: any) => {
      return this.languageService.getLangValue(data, this.lang);
    }

    this.formData.nameValue = getValue(this.formData.name);
    this.formData.contentSettings.submit.titleValue = getValue(this.formData.contentSettings.submit.title);
    this.formData.contentSettings.processingValue = getValue(this.formData.contentSettings.processing);
    this.formData.contentSettings.doneValue = getValue(this.formData.contentSettings.done);
    this.formData.contentSettings.messageValue = getValue(this.formData.contentSettings.message);

    this.formData.fields.forEach((field: any) => {
      if (field.label) { field.labelValue = getValue(field.label) };
      if (field.placeholder) { field.placeholderValue = getValue(field.placeholder) };
      if (field.options) {
        field.options.forEach((option: any) => {
          option.titleValue = getValue(option.title)
        });
      }
    });
  }

  getForms() {
    const demoForms = () => {
      const data: any = [
        {
          id: null,
          name: [
            {
              lang: 'vi',
              content: 'Li??n h??? v???i ch??ng t??i'
            }, {
              lang: 'en',
              content: 'Contact us'
            }
          ],
          config: {
            dbTable: 'web_contacts',
            returnEmail: 'mryu.vn@gmail.com',
            contactRequired: 'email'
          },
          contentSettings: {
            appearance: 'outline',
            floatLabel: 'always',
            labelPosition: 'block',
            submit: {
              icon: '<i class="fas fa-paper-plane"></i>',
              title: [
                {
                  lang: 'vi',
                  content: 'G???i'
                }, {
                  lang: 'en',
                  content: 'Send'
                }
              ],
              background: { type: 'accent' },
              color: { type: 'white' },
              styles: '{"height":"50px","fontSize":"18px","paddingLeft":"25px","paddingRight":"25px","borderRadius":"25px","boxShadow":"0 1px 3px -2px #000"}'
            },
            processing: [
              {
                lang: 'vi',
                content: '??ang g???i y??u c???u c???a b???n...'
              }, {
                lang: 'en',
                content: 'Sending your request'
              }
            ],
            done: [
              {
                lang: 'vi',
                content: 'G???i y??u c???u th??nh c??ng!'
              }, {
                lang: 'en',
                content: 'Your request has been sent!'
              }
            ],
            message: [
              {
                lang: 'vi',
                content: 'C???m ??n b???n ???? g???i th??ng tin! B??? ph???n ch??m s??c Kh??ch h??ng c???a ch??ng t??i ???? ghi nh???n v?? s??? tr??? l???i nhanh nh???t c?? th???.'
              }, {
                lang: 'en',
                content: 'Thanks for your request! Our customer care department has been received and we will reply you ASAP.'
              }
            ]
          },
          fields: [
            {
              inputType: 'input',
              type: 'text',
              required: true,
              label: [
                {
                  lang: 'vi',
                  content: 'H??? t??n'
                },
                {
                  lang: 'en',
                  content: 'Your name'
                }
              ],
              placeholder: [
                {
                  lang: 'vi',
                  content: 'Nh???p h??? t??n c???a b???n!'
                },
                {
                  lang: 'en',
                  content: 'Enter your name!'
                }
              ]
            },
            {
              inputType: 'phone',
              cols: { xl: 6, lg: 6, md: 12, sm: 12, xs: 12 },
              label: [
                {
                  lang: 'vi',
                  content: '??i???n tho???i'
                },
                {
                  lang: 'en',
                  content: 'Phone'
                }
              ]
            },
            {
              inputType: 'email',
              cols: { xl: 6, lg: 6, md: 12, sm: 12, xs: 12 },
              label: [
                {
                  lang: 'vi',
                  content: 'Email'
                },
                {
                  lang: 'en',
                  content: 'Email'
                }
              ],
            },
            {
              inputType: 'select',
              required: true,
              label: [
                {
                  lang: 'vi',
                  content: 'Ch??? ?????'
                },
                {
                  lang: 'en',
                  content: 'Subject'
                }
              ],
              placeholder: [
                {
                  lang: 'vi',
                  content: 'Ch???n ch??? ?????!'
                },
                {
                  lang: 'en',
                  content: 'Select a subject!'
                }
              ],
              options: [
                {
                  title: [
                    {
                      lang: 'vi',
                      content: 'Ch??? ????? 1'
                    }, {
                      lang: 'en',
                      content: 'Subject 1'
                    }
                  ]
                },
                {
                  title: [
                    {
                      lang: 'vi',
                      content: 'Ch??? ????? 2'
                    }, {
                      lang: 'en',
                      content: 'Subject 2'
                    }
                  ]
                },
                {
                  title: [
                    {
                      lang: 'vi',
                      content: 'Ch??? ????? 3'
                    }, {
                      lang: 'en',
                      content: 'Subject 3'
                    }
                  ]
                }
              ]
            },
            {
              inputType: 'textarea',
              required: false,
              label: [
                {
                  lang: 'vi',
                  content: 'N???i dung'
                },
                {
                  lang: 'en',
                  content: 'Content'
                }
              ],
              placeholder: [
                {
                  lang: 'vi',
                  content: 'Nh???p n???i dung c???n h??? tr???...'
                },
                {
                  lang: 'en',
                  content: 'Your content here...!'
                }
              ]
            }
          ]
        }
      ];

      return data;
    }
    const setFormData = () => {
      // const FORMS = demoForms();
      const FORMS = this.layoutService.FORMS;
      const e = FORMS.find((item: any) => item.id === this.formID);
      if (e) {
        e.config = this.appService.isObject(e.config).data;
        this.contactRequired = e.config.contactRequired;
        e.contentSettings = this.appService.isObject(e.contentSettings).data;
        const submit = e.contentSettings.submit;
        this.layoutService.getElementStyles(submit);
        e.bodyStyles = this.appService.isObject(e.contentSettings.bodyStyles).data;

        e.fields = this.appService.isArray(e.fields).data;
        e.fields.forEach((field: any) => {
          field.colsClass = this.layoutService.getColsClass(field.cols);
        });

        this.formData = e;
        this.setFormContent();
        // console.log(this.formData);
      };
    }

    if (this.layoutService.FORMS) {
      setFormData();
    } else {
      this.appService.getSqlData({ table: this.appService.tables.forms }).subscribe(res => {
        if (res.mess === 'ok') {
          this.layoutService.FORMS = res.data;
          setFormData();
        } else {
          this.appService.logErr(res.err, 'getForms()', 'ContactComponent');
        }
      }, err => this.appService.logErr(err, 'getForms()', 'ContactComponent'));
    }
  }

  getPhoneNumber($event: any, field: any) {
    if ($event) {
      field.value = $event.code + '-' + $event.number; 
    } else {
      field.value = null;
    }
  }

  checkContactRequire($event) {
    if ($event) {
      this.contactRequired = null;
    } else {
      this.contactRequired = this.formData.config.contactRequired;
    }
  }

  submit(formData: any, dataForm: any) {
    if (!dataForm.invalid && !this.processing) {
      this.processing = true;
      this.processData = {
        processing: true,
        status: formData.contentSettings.processingValue
      }

      const fields: any = [];
      formData.fields.forEach((field: any) => {
        fields.push({
          title: field.labelValue,
          value: field.value
        });
      });

      // this.processDone();
      // return false;

      const dataPost = {
        table: formData.config.dbTable,
        fields: {
          cat: this.formID,
          content: JSON.stringify(fields),
          createdBy: JSON.stringify({
            username: this.appService.userData.username,
            userAgent: this.appService.userAgent
          })
        },
        options: {
          createdTime: true,
          setReference: { length: 9 }
        }
      }
      this.appService.addSqlData(dataPost).subscribe(res => {
        if (res.mess === 'ok') {
          this.sendMail();

          const newData = res.data;
          newData.enabled = 1;
          const dataEmit = {
            message: this.socketioService.messages.webContact + '_' + this.appService.domain,
            emit: false,
            broadcast: true,
            content: {
              newData: newData
            }
          }
          this.socketioService.emit('client_emit', dataEmit);
          this.processDone();
        } else {
          this.processFail(res.err);
        }
      }, err => {
        this.processFail(err);
      });
    }
  }

  sendMail() {
    const mailAdmin = null; //API will provide default email
    const mailTo = this.formData.config.returnEmail;
    const time = new Date();
    const mailSubject = '[Li??n h??? t??? www.' + this.appService.domain + '] - ' + time.toString();
    
    const fields = [];
    this.formData.fields.forEach((field: any) => {
      const value = field.value ? field.value : 'N/A';
      const item = '<li>' + field.labelValue + ': ' + value + '</li>';
      fields.push(item);
    });
    
    const data = fields.join('');
    const message = `
      Ghi ch??: ????y l?? Email th??ng b??o nh???n tin t???c t??? trang web www.` + this.appService.domain + `; Kh??ng ph???i Spam.
      <br /> <em>(Note: This is notification email from website www.` + this.appService.domain + `; Not Spam.)</em>
    `;

    const mailContent = `
      <p>---<b>Kh??ch h??ng li??n h???:</b></p>
      <ul>` + data + `</ul>
      <em>Time: ` + time.toString() + `</em><br />
      <em>URL: ` + this.url + `</em>
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
        this.appService.logErr(res.err, 'sendMail()', 'FormDataComponent');
      } else {
        console.log('Email has been sent to Email: ' + mailTo);
      }
      // this.processDone();
    }, err => {
      this.appService.logErr(err, 'sendMail()', 'FormDataComponent');
      // this.processDone();
    });
  }

  processDone() {
    this.resetForm = true;
    this.formData.fields.forEach((field: any) => {
      field.value = ''
    });
    this.contactRequired = this.formData.config.contactRequired;

    setTimeout(() => {
      this.processData = {
        status: this.formData.contentSettings.doneValue,
        message: this.formData.contentSettings.messageValue,
        okBtn: true
      };
      this.resetForm = false;
    }, 1000);
  }

  processFail(err: any) {
    this.appService.logErr(err, 'submit()', 'FormDataComponent');
    setTimeout(() => {
      this.processData = {
        status: this.commonData.processErr,
        err: err
      }
      this.processing = false;
    }, 1000);
  }

  closeForm() {
    this.processData = null;
    setTimeout(() => {
      this.processing = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
