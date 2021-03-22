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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarModule } from 'src/app/templates/avatar/avatar.module';
import { ContinueBtnModule } from 'src/app/templates/continue-btn/continue-btn.module';
import { IconModule } from 'src/app/templates/icon/icon.module';
import { MainSliderModule } from '../_templates/main-slider/main-slider.module';
import { ContentQuoteModule } from '../_templates/content-quote/content-quote.module';
import { ContactFormModule } from '../_templates/contact-form/contact-form.module';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule,
    AvatarModule,
    ContinueBtnModule,
    IconModule,
    MainSliderModule,
    ContentQuoteModule,
    ContactFormModule
  ]
})
export class PageModule { }
