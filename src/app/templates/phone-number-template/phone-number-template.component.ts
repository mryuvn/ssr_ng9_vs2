import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-phone-number-template',
  templateUrl: './phone-number-template.component.html',
  styleUrls: ['./phone-number-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhoneNumberTemplateComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() lang!: string;
  @Input() data: any;
  @Input() label!: boolean;
  @Input() appearance: any;
  @Input() floatLabel: any;
  @Input() required: any;
  @Input() matError: any;
  @Input() isNumberOnly: any;

  @Output() emitData = new EventEmitter();

  langsData: any = [
    {
      lang: 'vi',
      code: {
        label: '',
        placeholder: 'Mã vùng',
        notValid: 'Mã vùng không hợp lệ!'
      },
      number: {
        label: 'Điện thoại',
        placeholder: 'Số điện thoại!',
        notValid: 'Chỉ nhập Số và không bao gồm khoảng trắng!'
      }
    },
    {
      lang: 'en',
      code: {
        label: '',
        placeholder: 'Dial code',
        notValid: 'Invalid Dial code!'
      },
      number: {
        label: 'Phone',
        placeholder: 'Phone number!',
        notValid: 'Enter Numbers only and do not include spaces!'
      }
    }
  ];
  langContent: any = {};

  myControl = new FormControl();
  options: any = [];
  filteredOptions!: Observable<any[]>;

  code: any;
  flagCode: any;
  number: any;

  codeInvalid: any;
  numberInvalid: any;

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
      this.code = this.data.code;
      this.number = this.data.number;
    }
    if (!this.code) {
      this.code = '+84';
    }
    this.myControl = new FormControl(this.code);

    if (this.appService.locations) {
      this.renderData();
    } else {
      this.getLocations();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // return this.options.filter(option => option.toLowerCase().includes(filterValue));
    return this.options.filter((option: any) => option.filterString.toLowerCase().includes(filterValue));
  }

  getlangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  renderData() {
    const options: any = [];
    this.appService.locations.forEach((e: any) => {
      const index = e.value.indexOf('country');
      if (index !== -1) {
        const name = '+' + e.countryData.dial_code + ' - ' + e.locationStr;
        const item = {
          name: name,
          code: e.code,
          dial_code: '+' + e.countryData.dial_code,
          filterString: name + ' ' + this.appService.removeAccents(e.locationStr)
        }
        options.push(item);
      }
    });

    this.options = options;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    if (this.code) {
      const item = this.options.find((i: any) => i.dial_code === this.code);
      if (item) {
        if (item.code) {
          this.flagCode = item.code.toLowerCase();
        }
      }
    }
  }

  getLocations() {
    this.appService.getLocations('').subscribe(res => {
      if (res.data) {
        this.appService.locations = res.data;
        this.renderData();
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  getCode() {
    const code = this.myControl.value;
    if (code) {
      const item = this.options.find((i: any) => i.dial_code === this.myControl.value);
      if (item) {
        this.codeInvalid = null;
        this.getData();
        if (item.code) {
          this.flagCode = item.code.toLowerCase();
        }
      } else {
        this.emitData.emit(null);
        this.flagCode = null;
        this.codeInvalid = this.langContent.code.notValid;
      }
    } else {
      this.emitData.emit(null);
      this.flagCode = null;
      this.codeInvalid = null;
    }
  }

  getData() {
    const code = this.myControl.value;
    if (code && this.number && !this.codeInvalid) {
      let number = this.number;

      if (this.isNumberOnly) {
        const notNumber = isNaN(number);
        if (notNumber) {
          this.numberInvalid = this.langContent.number.notValid;
        } else {
          const index = number.indexOf('.');
          if (index === -1) {
            this.numberInvalid = null;
          } else {
            this.numberInvalid = this.langContent.number.notValid;
          }
        }
      } else {
        this.numberInvalid = null;
      }

      if (this.numberInvalid) {
        this.emitData.emit(null);
      } else {
        const data = {
          code: this.myControl.value,
          number: number
        }
        this.emitData.emit(data);
      }
    } else {
      this.emitData.emit(null);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
