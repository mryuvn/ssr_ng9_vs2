import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { FooterComponent } from './footer.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from 'src/app/templates/icon/icon.module';
import { SafeHtmlModule } from 'src/app/safe-html';
import { NewsSubscribeFormModule } from '../contents/_templates/news-subscribe-form/news-subscribe-form.module';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule,
    IconModule,
    SafeHtmlModule,
    NewsSubscribeFormModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
