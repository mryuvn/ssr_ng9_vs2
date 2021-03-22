import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';

import { BannerBootstrapMdCarouselComponent } from './banner-bootstrap-md-carousel.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ContinueBtnModule } from '../continue-btn/continue-btn.module';

@NgModule({
  declarations: [BannerBootstrapMdCarouselComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule, WavesModule, ButtonsModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule, MatRadioModule, MatSlideToggleModule,
    ContinueBtnModule
  ],
  exports: [BannerBootstrapMdCarouselComponent]
})
export class BannerBootstrapMdCarouselModule { }
