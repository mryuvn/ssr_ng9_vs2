import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSubscribeFormComponent } from './news-subscribe-form.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [NewsSubscribeFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    SafeHtmlModule
  ],
  exports: [NewsSubscribeFormComponent]
})
export class NewsSubscribeFormModule { }
