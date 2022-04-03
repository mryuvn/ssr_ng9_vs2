import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-template',
  templateUrl: './button-template.component.html',
  styleUrls: ['./button-template.component.scss']
})
export class ButtonTemplateComponent implements OnInit {

  @Input() data: any;
  @Input() color: string;
  @Input() bgColor: string;
  @Input() styles: any;

  constructor() {}

  ngOnInit(): void {
    this.setData();
    // console.log(this.styles);
  }

  setData() {
    if (this.data.destination === 'href') {
      this.data.target = '_blank';
    }

    if (this.data.destination === 'call') {
      this.data.target = '_self';
      setTimeout(() => {
        this.data.destination = 'href';
        this.data.value = 'tel:' + this.data.value;
      }, 1);
    }
  }

  doAction() {
    console.log(this.data);
  }

}
