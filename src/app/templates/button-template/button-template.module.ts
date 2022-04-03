import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonTemplateComponent } from './button-template.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SafeHtmlModule } from 'src/app/safe-html';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    ButtonTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule, MatRippleModule,
    SafeHtmlModule
  ],
  exports: [ButtonTemplateComponent]
})
export class ButtonTemplateModule { }
