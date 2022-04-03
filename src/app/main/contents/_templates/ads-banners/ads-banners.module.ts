import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsBannersComponent } from './ads-banners.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [AdsBannersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule
  ],
  exports: [AdsBannersComponent]
})
export class AdsBannersModule { }
