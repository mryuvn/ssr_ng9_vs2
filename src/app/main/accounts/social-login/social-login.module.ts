import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialLoginComponent } from './social-login.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SocialLoginComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [SocialLoginComponent]
})
export class SocialLoginTemplateModule { }
