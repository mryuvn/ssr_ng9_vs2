import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _moment from 'moment';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-datepicker-templates',
  templateUrl: './datepicker-templates.component.html',
  styleUrls: ['./datepicker-templates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerTemplatesComponent implements OnInit {

  calendarHeader = CalendarHeader;

  @Input() appearance: String;
  @Input() floatLabel: string;
  @Input() matLabel: String;
  @Input() placeholder: String;
  @Input() required: any;
  @Input() readonly: Boolean;
  @Input() disabled: Boolean;
  @Input() defaultDate: Date;
  @Input() inputNotMatch: String;

  @Output() emitData = new EventEmitter();

  date = new FormControl();

  constructor() { }

  ngOnInit(): void {
    if (this.defaultDate) {
      this.setValue(this.defaultDate, this.disabled);
    }
  }

  setValue(defaultDate, disabled) {
    if (defaultDate) {
      const year = defaultDate.getFullYear();
      const m = defaultDate.getMonth() + 1;
      var month = m.toString();
      if (m < 10) {
        month = '0' + month;
      }
      const d = defaultDate.getDate();
      var date = d.toString();
      if (d < 10) {
        date = '0' + date;
      }
      const dateValue = year + '-' + month + '-' + date;

      this.date = new FormControl({ value: moment(dateValue), disabled: disabled });
    } else {
      this.date = new FormControl({ value: null, disabled: disabled });
    }
  }

  selectDate(date) {
    if (date) {
      const value = date.value;
      if (value) {
        const data = {
          d: value._d,
          i: {
            y: value._i.year,
            m: value._i.month + 1,
            d: value._i.date
          }
        }
        this.emitData.emit(data);
      } else {
        this.emitData.emit(null);
      }
    } else {
      this.emitData.emit(null);
    }
  }

}

/** Custom header component for datepicker. */
@Component({
  selector: 'example-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }

    .example-double-arrow .mat-icon {
      margin: -22%;
    }
  `],
  template: `
    <div class="example-header">
      <button mat-icon-button class="example-double-arrow" (click)="previousClicked('year')">
        <mat-icon>keyboard_arrow_left</mat-icon>
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="example-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
      <button mat-icon-button class="example-double-arrow" (click)="nextClicked('year')">
        <mat-icon>keyboard_arrow_right</mat-icon>
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}
