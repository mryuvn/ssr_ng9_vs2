import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductItemComponent implements OnInit {

  @Input() data: any;
  @Input() config: any;
  @Input() isBrowser!: boolean;
  @Input() activeID!: number;


  mainStyles: any = {};

  constructor(
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.data.itemStyles = this.config?.itemStyles?.styles;
    this.data.titleStyles = this.config?.title?.styles;
    this.data.captionStyles = this.config?.caption?.styles;

    setTimeout(() => {
      if (this.isBrowser) {
        const prodItemID = document.getElementById(this.data.prodItemID) as HTMLElement;
        if (this.config.itemStylesOnHover.background) {
          prodItemID?.style.setProperty('--prodItemBg', this.config.itemStylesOnHover.background.rgba);
        }
        if (this.config.itemStylesOnHover.color) {
          prodItemID?.style.setProperty('--prodItemColor', this.config.itemStylesOnHover.color.rgba);
        }
        if (this.config.itemStylesOnHover.boxShadow) {
          prodItemID?.style.setProperty('--prodItemShadow', this.config.itemStylesOnHover.boxShadow);
        }
        
        if (this.config.itemStylesOnHover.transition) {
          if (this.config.itemStylesOnHover.transition.value > 0) {
            this.config.itemStylesOnHover.transitionEffect = true;
            const transition = this.config.itemStylesOnHover.transition.value + this.config.itemStylesOnHover.transition.unit;
            prodItemID?.style.setProperty('--prodItemTransition', transition);
          }
        }
        if (this.config.itemStylesOnHover.zoomImage > 0) {
          const zoomImageSize = (this.config.itemStylesOnHover.zoomImage + 100) + '%';
          const zoomImageTop = (-this.config.itemStylesOnHover.zoomImage / 2) + '%';
          prodItemID?.style.setProperty('--prodItemZoomImageSize', zoomImageSize);
          prodItemID?.style.setProperty('--prodItemZoomImageTop', zoomImageTop);
        }
      }
    }, 1);
  }
}
