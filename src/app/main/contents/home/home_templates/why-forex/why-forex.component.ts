import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-why-forex',
  templateUrl: './why-forex.component.html',
  styleUrls: ['./why-forex.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhyForexComponent implements OnInit {

  @Input() data: any;
  @Input() isBrowser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
