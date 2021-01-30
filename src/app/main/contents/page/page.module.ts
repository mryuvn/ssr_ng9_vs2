import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: PageComponent
  },
  {
    path: ':pageID',
    component: PageComponent
  },
  {
    path: ':pageID/:path',
    component: PageComponent
  }
];

import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule
  ]
})
export class PageModule { }
