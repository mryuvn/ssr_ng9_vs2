import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() iconValue: any;

  iconData: any = {};

  constructor() { }

  ngOnInit(): void {
    if (this.iconValue) {
      const iconData = this.isJSON(this.iconValue);
      if (iconData) {
        this.iconData = iconData;
      }
    } else {
      console.log('iconData not found!');
    }
  }

  isJSON(value: string) {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
      } catch (error) {
        return null;
      }
      return JSON.parse(value);
    } else {
      return value;
    }
  }

}
