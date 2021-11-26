import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-forex-market',
  templateUrl: './forex-market.component.html',
  styleUrls: ['./forex-market.component.scss']
})
export class ForexMarketComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
