import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trade-with-us',
  templateUrl: './trade-with-us.component.html',
  styleUrls: ['./trade-with-us.component.scss']
})
export class TradeWithUsComponent implements OnInit {

  @Input() data;
  @Input() isBrowser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
