import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cat-item',
  templateUrl: './cat-item.component.html',
  styleUrls: ['./cat-item.component.scss']
})
export class CatItemComponent implements OnInit {

  @Input() lang: string;
  @Input() item: any;
  @Input() config: any;
  @Input() db_table: string;
  @Input() uploadPath: string;
  @Input() langContent: any;
  @Input() isBrowser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
