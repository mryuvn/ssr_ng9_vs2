import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  @Input() data: any;
  @Input() container: any;
  @Input() center: any;

  constructor() { }

  ngOnInit(): void {
  }

}
