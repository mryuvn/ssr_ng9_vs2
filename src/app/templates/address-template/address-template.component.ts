import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-address-template',
  templateUrl: './address-template.component.html',
  styleUrls: ['./address-template.component.scss']
})
export class AddressTemplateComponent implements OnInit, AfterViewInit {

  @Input() lang: string;
  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() required: any;
  @Input() matSuffix: any;
  @Input() disabled: boolean;
  @Input() requireMatchValue: any;
  @Input() flagIcon: boolean;

  @Input() formData: any; // { country: string, province: number, address: string }

  @Output() emitValue = new EventEmitter();
  @Output() emitData = new EventEmitter();

  langsData: any = [
    {
      lang: 'vi',
      country: {
        label: 'Quốc gia',
        placeholder: 'Chọn Quốc gia!'
      },
      province: {
        label: 'Tỉnh thành/bang',
        placeholder: 'Chọn Tỉnh Thành/Bang!'
      },
      address: {
        label: 'Địa chỉ',
        placeholder: 'Nhập địa chỉ (số nhà, đường phố hoặc Thôn xóm...)!'
      }
    },
    {
      lang: 'en',
      country: {
        label: 'Country',
        placeholder: 'Select a country!'
      },
      province: {
        label: 'Province or City',
        placeholder: 'Select a Province or City!'
      },
      address: {
        label: 'Address',
        placeholder: 'Enter house number, street...!'
      }
    }
  ];
  data: any = {};

  countryCode: string;
  countryControlValue: string;
  countries: any = [];

  provinceID: number;
  provinceControlValue: string;
  provinces: any = [];

  address: string;
  fullAddress: string;

  inputErr: any;

  @ViewChild('countryTemplate', { static: true }) countryTemplate;
  @ViewChild('provinceTemplate', { static: true }) provinceTemplate;

  constructor(
    private appService: AppService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.getLangData();
    const formData = this.appService.isObject(this.formData);
    this.countryCode = formData.country;
    this.provinceID = formData.province;
    this.address = formData.address;
  }

  ngAfterViewInit(): void {
    this.getCountries();
  }

  getCountries() {
    this.appService.getCountryData(null, this.lang).subscribe(res => {
      if (res.data) {
        const selected = [];
        res.data.forEach(e => {
          e.finderValue = e.nameValue;
          e.finderTitle = e.nameValue;
          e.finderString = e.nameValue + ' ' + e.code + ' ' + e.name + ' ' + this.appService.bodauTiengViet(e.name) + ' ' + this.appService.getStringtify(e.name);

          if (this.flagIcon && e.code) {
            e.flagIcon = e.code.toLowerCase();
          }

          if (e.code === this.countryCode) {
            selected.push(e);
          }
        });
        this.countries = res.data;
        const country = selected[0];
        if (country) {
          this.countryControlValue = country.finderValue;
          this.getProvinces(country.code);
        }
        this.countryTemplate.setData(this.countryControlValue, false);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      console.log({ err: err, time: new Date() });
    });
  }

  getProvinces(countryCode) {
    this.appService.getProvinceData(null, countryCode, this.lang).subscribe(res => {
      if (res.data) {
        const selected = [];
        res.data.forEach(e => {
          e.finderValue = e.nameValue;
          e.finderTitle = e.nameValue;
          e.finderString = e.nameValue + ' ' + e.nameValue + ' ' + this.appService.bodauTiengViet(e.nameValue) + ' ' + this.appService.getStringtify(e.nameValue);

          if (e.id === this.provinceID) {
            selected.push(e);
          }
        });
        this.provinces = res.data;
        const province = selected[0];
        if (province) {
          this.provinceControlValue = province.nameValue;
        } else {
          this.provinceControlValue = null;
          this.emitData.emit(null);
        }
      } else {
        this.provinces = [];
        this.provinceControlValue = null;
        this.emitData.emit(null);
      }
      setTimeout(() => {
        this.provinceTemplate.setData(this.provinceControlValue, false);
      }, 1);
    }, err => {
      console.log({ err: err, time: new Date() });
    });
  }

  getLangData() {
    this.data = this.languageService.getLangContent(this.langsData, this.lang);
  }

  selectCountry($event) {
    if ($event) {
      this.countryCode = $event.code;
      this.getProvinces(this.countryCode);
    } else {
      this.countryCode = null;
    }
    this.selectData();
  }

  selectProvince($event) {
    if ($event) {
      this.provinceID = $event.id;
    } else {
      this.provinceID = null;
    }
    this.selectData();
  }

  selectData() {
    if (this.inputErr || !this.countryCode || !this.provinceID) {
      this.emitData.emit(null);
    } else {
      const fullAddress = this.address + ', ' + this.provinceControlValue + ', ' + this.countryControlValue;
      const data = {
        country: this.countryCode,
        province: this.provinceID,
        address: this.address,
        value: fullAddress
      }
      this.emitData.emit(data);
    }
  }

}
