import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chips-template',
  templateUrl: './chips-template.component.html',
  styleUrls: ['./chips-template.component.scss']
})
export class ChipsTemplateComponent implements OnInit, OnDestroy {

  @Input() lang: string;
  @Input() appearance: string;
  @Input() floatLabel: string;
  @Input() matLabel: string;
  @Input() placeholder: string;
  @Input() required: any;
  @Input() matSuffix: string;
  @Input() selectAll: any;
  @Input() autocomplete: string;
  @Input() applyKeyCodes: number[];
  @Input() selectRequired: any;
  @Input() matErrBubble: any;

  @Input() dataSources: string[];
  @Input() selectedItems: string[];

  @Output() emitData = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  myCtrl = new FormControl();
  filteredOptions: Observable<string[]>;
  items: string[] = [];
  allItems: string[] = [];

  subscription: Subscription;

  langsData: any = [
    {
      lang: 'vi',
      items: 'các mục',
      enter: 'Nhập',
      select: 'Chọn',
      pleaseSelect: 'Hãy chọn',
      selectAllOr: 'Chọn All hoặc',
      removeAllToSelect: 'Xóa All để chọn từng mục',
      itemExisted: 'Giá trị này đã tồn tại!'
    },
    {
      lang: 'en',
      items: 'Items',
      enter: 'Enter',
      select: 'Select',
      pleaseSelect: 'Please select',
      selectAllOr: 'Select All or',
      removeAllToSelect: 'Remove All to select items',
      itemExisted: 'This value already exists!'
    }
  ];
  data: any = {};

  placeholderValue: String;
  showError: Boolean;
  itemExisted: string;

  @ViewChild('itemInput', { static: false }) itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private messageService: MessageService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data.lang;
        this.getLangData();
      }
    });
  }

  start() {
    this.filteredOptions = this.myCtrl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item) : this.allItems.slice()));
  }

  ngOnInit(): void {
    this.getLangData();

    if (this.applyKeyCodes) {
      this.applyKeyCodes.forEach(e => {
        this.separatorKeysCodes.push(e);
      });
    }

    if (this.selectAll) {
      this.dataSources.unshift('All');
    }

    if (this.selectedItems) {
      this.items = this.selectedItems;
    }

    if (this.dataSources) {
      const rs = this.items.find(item => item === 'All');
      if (rs) {
        this.allItems = [];
      } else {
        this.allItems = this.dataSources;
        this.items.forEach(item => {
          const index = this.allItems.indexOf(item);
          if (index >= 0) {
            this.allItems.splice(index, 1);
          }
        });
      }
      this.start();
    }
    this.setPlaceHolder();
  }

  getLangData() {
    const data = this.langsData.find(item => item.lang === this.lang);
    if (data) {
      this.data = data;
    } else {
      this.data = this.langsData[0];
    }
  }

  setPlaceHolder() {
    if (!this.placeholder) {
      this.placeholder = this.data.items;
    }

    if (this.selectRequired) {
      if (this.selectAll && this.items.length === 0) {
        this.placeholderValue = this.data.selectAllOr + ' ' + this.placeholder;
      } else if (this.selectAll && this.items.length > 0) {
        const rs = this.items.find(item => item === 'All');
        if (!rs) {
          this.placeholderValue = this.data.select + ' ' + this.placeholder;
        } else {
          this.placeholderValue = this.data.removeAllToSelect + ' ' + this.placeholder;
        }
      } else {
        this.placeholderValue = this.data.select + ' ' + this.placeholder;
      }
    } else {
      this.placeholderValue = this.data.enter + ' ' + this.placeholder;
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if (!this.selectRequired) {
        // Add our item
        if ((value || '').trim()) {
          if (value.trim() === 'All') {
            this.items = [];
            this.allItems = [];
          } else {
            const index = this.allItems.indexOf(value.trim());
            if (index >= 0) {
              this.allItems.splice(index, 1);
            }
          }
          const rs = this.items.find(item => item === value.trim());
          if (!rs) {
            this.items.push(value.trim());
            this.start();
            this.itemExisted = null;
          } else {
            this.itemExisted = this.data.itemExisted;
            this.showError = true;
          }
        }

        // Reset the input value
        if (input) {
          input.value = '';
        }

        this.myCtrl.setValue(null);

        this.emitData.emit(this.items);
        this.showError = false;
        this.setPlaceHolder();
      } else {
        if (value.trim()) {
          this.showError = true;
        } else {
          this.showError = false;
        }
      }
    }
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items.splice(index, 1);
    }

    if (item === 'All') {
      this.allItems = this.dataSources;
    } else {
      this.allItems.push(item);
    }
    this.start();

    this.emitData.emit(this.items);
    this.showError = false;
    this.setPlaceHolder();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (event.option.viewValue === 'All') {
      this.items = [];
      this.allItems = [];
    } else {
      const index = this.allItems.indexOf(event.option.viewValue);
      if (index >= 0) {
        this.allItems.splice(index, 1);
      }
    }

    this.items.push(event.option.viewValue);
    this.itemInput.nativeElement.value = '';
    this.myCtrl.setValue(null);

    this.start();

    this.emitData.emit(this.items);
    this.showError = false;
    this.setPlaceHolder();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allItems.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
