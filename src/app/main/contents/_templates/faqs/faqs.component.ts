import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  @Input() dataSource: any;
  @Input() langContent: any;

  constructor() { }

  ngOnInit(): void {
    // this.fakeData();
  }

  fakeData() {
    const data: any = [];
    for (let index = 0; index < 8; index++) {
      const item: any = {
        title: 'Lorem ipsum dolor sit amet',
        content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. In hic consequuntur laudantium iure excepturi eveniet, illo sit dolorem quasi at ducimus ipsam fugiat unde dolore beatae aperiam, explicabo ipsa! Rem?'
      }
      data.push(item);
    }

    this.dataSource = data;
  }

}
