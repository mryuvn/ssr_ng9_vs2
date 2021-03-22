import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { SingleAutocompleteComponent } from '../autocomplete-templates/single-autocomplete/single-autocomplete.component';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-phone-number-form-field-template',
  templateUrl: './phone-number-form-field-template.component.html',
  styleUrls: ['./phone-number-form-field-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PhoneNumberFormFieldTemplateComponent implements OnInit, OnDestroy {

  @Input() lang: string;
  @Input() data: any;
  @Input() formStyle: string;
  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() matLabel: string;
  @Input() placeholder: string;
  @Input() matSuffix: any;
  @Input() countryMatlabel: string;
  @Input() countryPlaceholder: string;
  @Input() required: any;
  @Input() dataSource: any;
  @Input() indexItem: any;

  @Output() emitData = new EventEmitter();

  subscription: Subscription;

  langsData: any = [
    {
      lang: 'vi',
      countryPlaceholder: 'Mã vùng',
      requireMatchValue: 'Mã vùng không khớp!',
      matLabel: 'Số Điện thoại',
      placeholder: 'Nhập số điện thoại!',
      isExistence: 'Số này đã tồn tại!'
    },
    {
      lang: 'en',
      countryPlaceholder: 'Dial code',
      requireMatchValue: 'Dial code is not match!',
      matLabel: 'Phone number',
      placeholder: 'Enter phone number!',
      isExistence: 'Phone number already exists'
    }
  ];
  langData: any = {};

  countriesData: any;
  code: string;
  number: number;
  myControl: string;
  countryCode: string;
  onDialCodeFocus: Boolean;
  inputedCode: string;

  codeError: any;
  isExistence: string;

  @ViewChild(SingleAutocompleteComponent, { static: true }) autoComplete: SingleAutocompleteComponent;

  constructor(
    private appService: AppService,
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data.lang;
        this.getLangData();
      }
    });
  }

  ngOnInit() {
    this.getLangData();

    if (!this.formStyle) {
      this.formStyle = 'style_2';
    }

    if (this.data) {
      if (this.data.code) {
        this.code = '+' + this.data.code;
      } else {
        this.code = '+84';
      }
      if (this.data.number) {
        const rs = isNaN(this.data.number);
        if (rs) {
          this.number = parseInt(this.appService.getStringtify(this.data.number));
        } else {
          this.number = this.data.number;
        }
      }
    } else {
      this.code = '+84';
      this.number = null;
    }
    this.myControl = this.code;
    
    // this.appService.getApiData('https://nodejs.vflservices.com/api/get-countries-data').subscribe(res => {
    this.appService.getCountryData('', this.lang).subscribe(res => {
      if (res.data) {
        const countriesData = [];
        res.data.forEach(e => {
          const dial_code = '+' + e.dial_code;
          e.finderValue = dial_code,
          e.finderTitle = dial_code + ' - ' + e.nameValue + ' (' + e.code + ')',
          e.finderString = e.nameValue + ' ' + this.appService.getStringtify(e.nameValue) + ' ' + e.code + ' ' + dial_code
          countriesData.push(e);
        });
  
        this.countriesData = countriesData;
        this.setMyControlValue(this.code, false);
  
        const rs = res.data.find(data => '+' + data.dial_code === this.code);
        if (rs) {
          if (rs.code) {
            this.countryCode = rs.code.toLowerCase();
          }
        }
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  getLangData() {
    const rs = this.langsData.find(item => item.lang === this.lang);
    if (rs) {
      this.langData = rs;
    } else {
      this.langData = this.langsData[0];
    }
  }

  setMyControlValue(value, disabled) {
    const string = value.toString();
    this.autoComplete.setData(string, disabled);
  }

  getCode($event) {
    if ($event) {
      this.code = $event.dial_code;
    } else {
      this.code = null;
    }
    if (this.countriesData) {
      var rs = this.countriesData.find(data => data.dial_code === this.code);
    }
    if (rs) {
      if (rs.code) {
        this.countryCode = rs.code.toLowerCase();
      }
    }

    this.getData();
  }

  getData() {
    if (this.code && this.number) {
      const data = {
        code: this.code.toString().replace(/[+]+/g, ""),
        number: this.number
      }
      if (this.dataSource) {
        const rs = this.dataSource.find(item => item.code == data.code && item.number == data.number); //Must be ==
        if (rs) {
          const index = this.dataSource.indexOf(rs);
          if (index !== this.indexItem) {
            this.isExistence = this.langData.isExistence;
          } else {
            this.isExistence = null;
          }
        } else {
          this.isExistence = null;
        }
  
        if (this.isExistence) {
          this.emitData.emit(null);
        } else {
          this.emitData.emit(data);
        }
      } else {
        this.emitData.emit(data);
      }
    } else {
      this.isExistence = null;
      this.emitData.emit(null);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
