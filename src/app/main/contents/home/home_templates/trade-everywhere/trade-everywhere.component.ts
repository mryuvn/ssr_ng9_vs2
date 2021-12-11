import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trade-everywhere',
  templateUrl: './trade-everywhere.component.html',
  styleUrls: ['./trade-everywhere.component.scss']
})
export class TradeEverywhereComponent implements OnInit {

  @Input() data: any;
  @Input() isBrowser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
