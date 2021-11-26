import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSliderComponent } from './main-slider.component';

import { BannerBootstrapMdCarouselModule } from 'src/app/templates/banner-bootstrap-md-carousel/banner-bootstrap-md-carousel.module';
import { ContinueBtnModule } from 'src/app/templates/continue-btn/continue-btn.module';
import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [MainSliderComponent],
  imports: [
    CommonModule,
    BannerBootstrapMdCarouselModule,
    ContinueBtnModule,
    SafeHtmlModule
  ],
  exports: [MainSliderComponent]
})
export class MainSliderModule { }
