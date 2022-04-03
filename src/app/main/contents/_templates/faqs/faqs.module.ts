import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqsComponent } from './faqs.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [FaqsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule
  ],
  exports: [FaqsComponent]
})
export class FaqsModule { }
