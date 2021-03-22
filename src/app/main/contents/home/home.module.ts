import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MainSliderModule } from '../_templates/main-slider/main-slider.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MainSliderModule
  ]
})
export class HomeModule { }
