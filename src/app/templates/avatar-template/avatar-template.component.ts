import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

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

  mainImage: any = {};

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    if (!this.noImage) { this.noImage = this.appService.webAvatar };
    if (!this.noImage) { this.noImage = 'assets/imgs/no-image.jpg' };

    if (this.dataSource.length > 0) {
      this.mainImage = this.dataSource[0];
    }
  }

}
