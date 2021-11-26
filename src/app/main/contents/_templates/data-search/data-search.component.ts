import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.scss']
})
export class DataSearchComponent implements OnInit {

  @Input() ID: string;

  @Output() closeForm = new EventEmitter();

  searchKey: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit(): void {
  }

  focus() {
    const id = 'dataSearchInput_' + this.ID;
    const el = this.document.getElementById(id) as HTMLElement;
    setTimeout(() => {
      if (el) {
        el.focus();
      }
    }, 1);
  }

  search(string: string) {
    console.log(string);
    setTimeout(() => {
      this.searchKey = '';
      this.closeForm.emit();
    }, 1);
  }

}
