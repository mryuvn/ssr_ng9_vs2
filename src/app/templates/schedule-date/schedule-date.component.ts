import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule-date',
  templateUrl: './schedule-date.component.html',
  styleUrls: ['./schedule-date.component.scss']
})
export class ScheduleDateComponent implements OnInit {

  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() oneWay: any;
  @Input() startDate: any;
  @Input() returnDate: any;
  @Input() matLabel: string;
  @Input() placeholder: string;

  @Output() emitData = new EventEmitter();

  lang: string;
  langsData: any = [
    {
      lang: 'vi',
      cannotBeforeToday: 'không được trong quá khứ!',
      mustBeAffter: 'phải sau'
    },
    {
      lang: 'en',
      cannotBeforeToday: 'không được trong quá khứ!',
      mustBeAffter: 'phải sau'
    }
  ];
  langContent: any = {};

  resetReturnDate: boolean;
  data: any = {};
  error: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.getLangData();

    const time = new Date();
    if (!this.startDate) {
      this.startDate = {
        label: 'Start date',
        placeholder: 'Select date!',
        default: time
      }
    } else {
      if (!this.startDate.default) {
        this.startDate.default = time;
      }
    }
    this.startDate.value = this.getDate(this.startDate.default).d;

    if (!this.returnDate) {
      this.returnDate = {
        label: 'Return date',
        placeholder: 'Select date!',
        default: time
      }
    } else {
      if (!this.returnDate.default && !this.returnDate.disabled) {
        this.returnDate.default = this.startDate.default;
      }
    }
    this.returnDate.value = this.getDate(this.returnDate.default).d;

    this.data = {
      start: this.getDate(this.startDate.default),
      return: this.getDate(this.returnDate.default)
    }
    this.emitData.emit(this.data);
  }

  getLangData() {
    const data = this.langsData.find(item => item.lang === this.lang);
    if (data) {
      this.langContent = data;
    } else {
      this.langContent = this.langsData[0];
    }
  }

  getStartDate($event) {
    if ($event) {
      this.data.start = $event;
      this.startDate.value = this.getDate($event.d).d;
      const today = this.getDate(new Date()).d;
      if ((this.startDate.value.getTime() - today.getTime()) < 0) {
        this.error = this.startDate.label + ' ' + this.langContent.cannotBeforeToday;
        this.emitData.emit(null);
        this.resetReturnDate = true;
        this.returnDate.disabled = true;
        setTimeout(() => {
          this.resetReturnDate = false;
        }, 1);
      } else {
        this.error = null;

        if (!this.oneWay) {
          if ((this.startDate.value.getTime() - this.returnDate.value.getTime()) > 0) {
            this.data.return = this.data.start;
            this.returnDate.default = $event.d;
            this.resetReturnDate = true;
            this.returnDate.disabled = false;
            setTimeout(() => {
              this.resetReturnDate = false;
              this.returnDate.value = this.getDate($event.d).d;
            }, 1);
          } else {
            if (this.returnDate.disabled) {
              this.returnDate.disabled = false;
              this.resetReturnDate = true;
              setTimeout(() => {
                this.resetReturnDate = false;
              }, 1);
            }
          }
        }

        this.emitData.emit(this.data);
      }
    } else {
      this.emitData.emit(null);
    }
  }

  getReturnDate($event) {
    if ($event) {
      this.data.return = $event;
      this.returnDate.value = this.getDate($event.d).d;
      if ((this.returnDate.value.getTime() - this.startDate.value.getTime() < 0)) {
        this.error = this.returnDate.label + ' ' + this.langContent.mustBeAffter + ' ' + this.startDate.label + '!';
        this.emitData.emit(null);
      } else {
        this.error = null;
        this.emitData.emit(this.data);
      }
    } else {
      this.emitData.emit(null);
    }
  }

  getDate(time: Date) {
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const date = y + '-' + m + '-' + d;
    const data = {
      d: new Date(date),
      i: {
        y: y,
        m: m,
        d: d
      }
    }
    return data;
  }

}
