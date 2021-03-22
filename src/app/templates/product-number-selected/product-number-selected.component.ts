import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-number-selected',
  templateUrl: './product-number-selected.component.html',
  styleUrls: ['./product-number-selected.component.scss']
})
export class ProductNumberSelectedComponent implements OnInit {

  @Input() number: number;
  @Input() available: number;

  @Output() emitData = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    if (!this.number) {
      this.number = 0;
    }
  }

  remove() {
    if (this.number > 0) {
      this.number = this.number - 1;
      this.emitData.emit(this.number);
    }
  }

  add() {
    this.number = this.number + 1;
    this.emitData.emit(this.number);
  }

}
