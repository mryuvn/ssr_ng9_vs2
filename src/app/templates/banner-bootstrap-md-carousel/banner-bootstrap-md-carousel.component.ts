import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-banner-bootstrap-md-carousel',
  templateUrl: './banner-bootstrap-md-carousel.component.html',
  styleUrls: ['./banner-bootstrap-md-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BannerBootstrapMdCarouselComponent implements OnInit {

  @Input() config: any;
  @Input() dataSource: any;
  @Input() userData: any;
  @Input() editTool: any;

  animations: any = ['fade', 'slide'];
  changeAnimationEvent: Boolean;
  openConfig: Boolean;

  constructor() { }

  ngOnInit(): void {
  }

  doAction(action) {
    console.log(action);
  }

  changeAnimation() {
    this.changeAnimationEvent = true;
    setTimeout(() => {
      this.changeAnimationEvent = false;
    }, 300);
    this.changeConfig();
  }

  changeConfig() {
    console.log(this.config);
  }

}
