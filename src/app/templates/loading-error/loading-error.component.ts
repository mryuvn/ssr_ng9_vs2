import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading-error',
  templateUrl: './loading-error.component.html',
  styleUrls: ['./loading-error.component.scss']
})
export class LoadingErrorComponent implements OnInit {

  @Input() data: any;
  @Input() bg: any;
  @Input() fixed: any;

  @Output() retry = new EventEmitter();

  show: string;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.show = 'show';
    }, 300);
  }

}
