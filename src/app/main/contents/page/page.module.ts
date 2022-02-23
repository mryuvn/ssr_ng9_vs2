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
    path: ':moduleRoute',
    component: PageComponent
  },
  {
    path: ':moduleRoute/:pageID',
    component: PageComponent
  },
  {
    path: ':moduleRoute/:pageID/:path',
    component: PageComponent
  }
];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule
  ]
})
export class PageModule { }
