import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-single-autocomplete',
  templateUrl: './single-autocomplete.component.html',
  styleUrls: ['./single-autocomplete.component.scss']
})
export class SingleAutocompleteComponent implements OnInit {

  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() matlabel: string;
  @Input() placeholder: string;
  @Input() required: any;
  @Input() matSuffix: string;
  @Input() options: any;
  @Input() myControlValue: string;
  @Input() disabled: Boolean;
  @Input() requireMatchValue: any;

  @Input() flagIcon: string;
  @Input() withAvatar: boolean;

  @Output() emitValue = new EventEmitter();
  @Output() emitData = new EventEmitter();
  @Output() emitFocus = new EventEmitter();
  @Output() emitBlur = new EventEmitter();
  @Output() emitError = new EventEmitter();

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  inputNotMatch: string;
  showInputNotMatchNotif: Boolean;

  constructor() { }

  ngOnInit() {
    if (this.flagIcon) {
      this.flagIcon = this.flagIcon.toLowerCase();
    }
    this.myControl = new FormControl({ value: this.myControlValue, disabled: this.disabled });
    if (this.options) {
      this.start();
    }
  }

  start() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    // console.log(this.options);
    if (value) {
      if (typeof value !== 'string') {
      }
      value = value.toString();
      var filterValue = value.toLowerCase();
      // return this.options.filter(option => option.finderString.toLowerCase().indexOf(filterValue) === 0);
      return this.options.filter(option => option.finderString.toLowerCase().includes(filterValue));
    }
  }

  setData(myControl, disabled) {
    this.myControl = new FormControl({ value: myControl, disabled: disabled });
    this.start();
  }

  selectData(value) {
    this.emitValue.emit(value);

    if (this.options) {
      const rs = this.options.find(data => data.finderValue === value);
      if (rs) {
        if (this.matSuffix === 'flagIcon') {
          this.flagIcon = rs.code.toLowerCase();
        }
        this.emitData.emit(rs);
        this.inputNotMatch = null;
      } else {
        this.flagIcon = null;
        this.emitData.emit(null);
        if (this.requireMatchValue === true) {
          this.inputNotMatch = 'Inputed value is not match!';
        } else {
          this.inputNotMatch = this.requireMatchValue;
        }
      }
      this.emitError.emit(this.inputNotMatch);
    }
  }

  onFocus(value) {
    this.emitFocus.emit(value);
  }

  onBlur(value) {
    this.emitBlur.emit(value);
    if (value && this.inputNotMatch && this.requireMatchValue) {
      this.showInputNotMatchNotif = true;
    } else {
      this.showInputNotMatchNotif = false;
    }
  }

}
