import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-string-autocomplete',
  templateUrl: './string-autocomplete.component.html',
  styleUrls: ['./string-autocomplete.component.scss']
})
export class StringAutocompleteComponent implements OnInit {

  @Input() appearance: String;
  @Input() required: any;
  @Input() matlabel: String;
  @Input() placeholder: String;
  @Input() matSuffix: String;
  @Input() options: string[];
  @Input() myControlValue: String;
  @Input() disabled: any;
  @Input() requireMatchValue: any;

  @Output() emitValue = new EventEmitter();
  @Output() emitData = new EventEmitter();

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  inputNotMatch: String;
  showInputNotMatchNotif: Boolean;

  constructor() { }

  ngOnInit() {
    this.myControl = new FormControl({ value: this.myControlValue, disabled: this.disabled });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  setData(myControl, disabled) {
    this.myControl = new FormControl({ value: myControl, disabled: disabled});
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  selectData(value) {
    this.emitValue.emit(value);
    if (this.requireMatchValue) {
      const rs = this.options.find(item => item === value);
      if (rs) {
        this.emitData.emit(value);
        this.inputNotMatch = null;
      } else {
        this.emitData.emit(null);
        if (this.requireMatchValue === true) {
          this.inputNotMatch = 'Inputed value is not match!';
        } else {
          this.inputNotMatch = this.requireMatchValue;
        }
      }
    } else {
      this.emitData.emit(value);
    }
  }

  onBlur(value) {
    if (value && this.inputNotMatch && this.requireMatchValue) {
      this.showInputNotMatchNotif = true;
    } else {
      this.showInputNotMatchNotif = false;
    }
  }

}
