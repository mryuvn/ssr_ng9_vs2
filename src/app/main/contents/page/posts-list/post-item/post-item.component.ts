import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  @Input() item: any;
  @Input() config: any;
  @Input() db_table: string;
  @Input() uploadPath: string;
  @Input() langData: any;
  @Input() dateFormat: string;
  @Input() isBrowser: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
