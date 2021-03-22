import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

import { SingleAutocompleteComponent } from '../autocomplete-templates/single-autocomplete/single-autocomplete.component';

@Component({
  selector: 'app-location-finder-template',
  templateUrl: './location-finder-template.component.html',
  styleUrls: ['./location-finder-template.component.scss']
})
export class LocationFinderTemplateComponent implements OnInit {

  @Input() lang: string;
  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() matlabel: string;
  @Input() placeholder: string;
  @Input() required: any;
  @Input() matSuffix: string;
  @Input() myControl: string;
  @Input() selectedLocation: string;
  @Input() countryCode: string;
  @Input() disabled: boolean;
  @Input() requireMatchValue: any;
  @Input() hideVietnam: any;
  @Input() fullData: any;
  @Input() countryOnly: any;
  @Input() vietnamOnly: any;
  @Input() flagIcon: boolean;

  @Output() emitValue = new EventEmitter();
  @Output() emitData = new EventEmitter();

  @ViewChild(SingleAutocompleteComponent, { static: true }) autoComplete: SingleAutocompleteComponent;

  data: any;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.getData(null, null);
  }

  getData(myControl, disabled) {
    this.appService.getLocations(this.lang).subscribe(res => {
      if (res.data) {
        const data = [];
        res.data.forEach(e => {
          e.finderValue = e.locationStr;
          e.finderTitle = e.locationStr;
          e.finderString = e.locationStr + ' ' + this.appService.bodauTiengViet(e.locationStr) + ' ' + this.appService.getStringtify(e.locationStr) + ' ' + e.locationStr.replace(/-/g, " ") + ' ' + this.appService.bodauTiengViet(e.locationStr.replace(/-/g, " ")) + ' ' + this.appService.getStringtify(e.locationStr).replace(/-/g, "") + ' ' + e.countryData.name + ' ' + this.appService.bodauTiengViet(e.countryData.name) + ' ' + this.appService.getStringtify(e.countryData.name);

          if (this.flagIcon && e.code) {
            e.flagIcon = e.code.toLowerCase();
          }

          if (this.hideVietnam && e.code === 'VN') {
            e.hidden = true;
          }

          const valueArr = e.value.split(':');
          e.type = valueArr[0];

          if (this.vietnamOnly && e.code !== 'VN' || this.vietnamOnly && e.type === 'country') {
            e.hidden = true;
          }

          if (this.countryOnly) {
            if (e.type !== 'country') {
              e.hidden = true;
            }
          } else {
            if (!this.fullData) {
              if (e.type === 'distr' || e.type === 'ward') {
                e.hidden = true;
              }
            }
          }

          data.push(e);
        });
        this.data = data;
        this.autoComplete.options = this.data;
        this.autoComplete.start();

        if (myControl !== null) {
          this.setMyControlValue(myControl, disabled);
        } else {
          if (!this.myControl) {
            if (this.countryCode) {
              var selectedItem = this.data.find(e => e.type === 'country' && e.code === this.countryCode);
            } else if (this.selectedLocation) {
              var selectedItem = this.data.find(e => e.value === this.selectedLocation);
            } else {
              var selectedItem = null;
            }
            if (selectedItem) {
              this.myControl = selectedItem.finderValue;
              this.setMyControlValue(this.myControl, disabled);
            }
          }
        }
      } else {
        console.log(res);
      }
    }, err => console.log(err));
  }

  setMyControlValue(value, disabled) {
    this.autoComplete.setData(value, disabled);
  }

  selectValue($event) {
    this.emitValue.emit($event);
  }

  selectData($event) {
    if ($event) {
      var province = null;
      if ($event.provinceData) {
        province = $event.provinceData.id;
      }
      var distric = null;
      if ($event.districData) {
        distric = $event.districData.id;
      }
      var ward = null;
      if ($event.wardData) {
        ward = $event.wardData.id;
      }
      $event.locationData = {
        country: $event.code,
        province: province,
        distric: distric,
        ward: ward
      }
    }
    this.emitData.emit($event);
  }

}
