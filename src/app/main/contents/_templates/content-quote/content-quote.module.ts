import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentQuoteComponent } from './content-quote.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [ContentQuoteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule
  ],
  exports: [ContentQuoteComponent]
})
export class ContentQuoteModule { }
