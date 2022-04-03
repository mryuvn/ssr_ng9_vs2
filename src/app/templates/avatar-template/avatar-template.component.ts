import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-avatar-template',
  templateUrl: './avatar-template.component.html',
  styleUrls: ['./avatar-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvatarTemplateComponent implements OnInit {

  @Input() dataSource: any;
  @Input() alt!: string;
  @Input() noImage!: string | null;
  @Input() isBrowser!: boolean;
  @Input() heightStyles: any;
  @Input() marginTop: any;
  @Input() circle!: boolean;

  constructor() { }

  ngOnInit(): void {
    if (!this.noImage) {
      this.noImage = 'no-image.jpg'
    }
  }

}
