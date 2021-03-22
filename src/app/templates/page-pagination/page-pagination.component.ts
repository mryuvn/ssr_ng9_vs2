import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-pagination',
  templateUrl: './page-pagination.component.html',
  styleUrls: ['./page-pagination.component.scss']
})
export class PagePaginationComponent implements OnInit {

  @Input() position: string;
  @Input() DATA: any;
  @Input() perPage: number;

  @Output() emitData = new EventEmitter();

  dataSource: any = [];
  pageNumber: number = 1;
  placeContent: string;

  constructor() { }

  ngOnInit(): void {
    if (this.position === 'right') {
      this.placeContent = 'flex-end';
    } else if (this.position === 'center') {
      this.placeContent = 'center';
    } else {
      this.placeContent = '';
    }

    if (this.DATA) {
      if (!this.perPage) {
        this.perPage = 12;
      }
      setTimeout(() => {
        this.renderData(this.DATA, this.perPage);
      }, 1);
    }
  }

  renderData(dataSource, perPage) {
    const DATA = [];
    var items = [];
    dataSource.forEach(e => {
      items.push(e);
      const length = items.length;
      if (length === perPage) {
        DATA.push(items);
        items = [];
      }
    });
    if (items.length > 0) {
      DATA.push(items);
    }
    this.dataSource = DATA;
    if (DATA.length > 0) {
      const ordinal = this.pageNumber - 1;
      const event = {
        data: DATA[ordinal],
        pageNumber: 0
      }
      this.emitData.emit(event);
    }
  }

  selectPage(page, i) {
    if ((i + 1) !== this.pageNumber) {
      this.pageNumber = i + 1;
      const event = {
        data: page,
        pageNumber: i
      }
      this.emitData.emit(event);
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      const data = this.dataSource[(this.pageNumber - 2)];
      this.pageNumber = this.pageNumber - 1;
      const event = {
        data: data,
        pageNumber: 'prev'
      }
      this.emitData.emit(event);
    }
  }

  nextPage() {
    if (this.pageNumber < this.dataSource.length) {
      const data = this.dataSource[this.pageNumber];
      this.pageNumber = this.pageNumber + 1;
      const event = {
        data: data,
        pageNumber: 'next'
      }
      this.emitData.emit(event);
    }
  }

}
