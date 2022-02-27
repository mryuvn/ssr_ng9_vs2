import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
