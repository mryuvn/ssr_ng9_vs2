import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';

import { EmailFormFieldTemplateModule } from 'src/app/templates/email-form-field-template/email-form-field-template.module';
import { PhoneNumberFormFieldTemplateModule } from 'src/app/templates/phone-number-form-field-template/phone-number-form-field-template.module';
import { SocialLoginTemplateModule } from '../social-login/social-login.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatRadioModule,
    EmailFormFieldTemplateModule,
    PhoneNumberFormFieldTemplateModule,
    SocialLoginTemplateModule
  ],
  exports: [LoginComponent]
})
export class LoginModule { }
