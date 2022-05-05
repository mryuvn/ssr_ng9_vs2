import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _moment from 'moment';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'LL'],
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-range-template',
  templateUrl: './date-range-template.component.html',
  styleUrls: ['./date-range-template.component.scss']
})
export class DateRangeTemplateComponent implements OnInit {

  @Input() start: any;
  @Input() end: any;

  @Output() emitData = new EventEmitter();

  startDate = new FormControl();
  endDate = new FormControl();

  date = new FormControl(new Date());

  data: any = {
    start: '',
    end: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.getDate();
  }

  getDate() {
    this.data.start = new Date(this.start);
    this.data.end = new Date(this.end);
    this.startDate = new FormControl(new Date(this.data.start));
    this.endDate = new FormControl(new Date(this.data.end));
  }

  getStartDate(startDate: any) {
    this.data.start = startDate.value;
    this.emitData.emit(this.data);
  }

  getEndDate(endDate: any) {
    this.data.end = endDate.value;
    this.emitData.emit(this.data);
  }

}
