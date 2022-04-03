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
              content: 'Liên hệ với chúng tôi'
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
                  content: 'Gửi'
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
                content: 'Đang gửi yêu cầu của bạn...'
              }, {
                lang: 'en',
                content: 'Sending your request'
              }
            ],
            done: [
              {
                lang: 'vi',
                content: 'Gửi yêu cầu thành công!'
              }, {
                lang: 'en',
                content: 'Your request has been sent!'
              }
            ],
            message: [
              {
                lang: 'vi',
                content: 'Cảm ơn bạn đã gửi thông tin! Bộ phận chăm sóc Khách hàng của chúng tôi đã ghi nhận và sẽ trả lời nhanh nhất có thể.'
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
                  content: 'Họ tên'
                },
                {
                  lang: 'en',
                  content: 'Your name'
                }
              ],
              placeholder: [
                {
                  lang: 'vi',
                  content: 'Nhập họ tên của bạn!'
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
                  content: 'Điện thoại'
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
                  content: 'Chủ đề'
                },
                {
                  lang: 'en',
                  content: 'Subject'
                }
              ],
              placeholder: [
                {
                  lang: 'vi',
                  content: 'Chọn chủ đề!'
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
                      content: 'Chủ đề 1'
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
                      content: 'Chủ đề 2'
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
                      content: 'Chủ đề 3'
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
                  content: 'Nội dung'
                },
                {
                  lang: 'en',
                  content: 'Content'
                }
              ],
              placeholder: [
                {
                  lang: 'vi',
                  content: 'Nhập nội dung cần hỗ trợ...'
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
    const mailSubject = '[Liên hệ từ www.' + this.appService.domain + '] - ' + time.toString();
    
    const fields = [];
    this.formData.fields.forEach((field: any) => {
      const value = field.value ? field.value : 'N/A';
      const item = '<li>' + field.labelValue + ': ' + value + '</li>';
      fields.push(item);
    });
    
    const data = fields.join('');
    const message = `
      Ghi chú: Đây là Email thông báo nhận tin tức từ trang web www.` + this.appService.domain + `; Không phải Spam.
      <br /> <em>(Note: This is notification email from website www.` + this.appService.domain + `; Not Spam.)</em>
    `;

    const mailContent = `
      <p>---<b>Khách hàng liên hệ:</b></p>
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
