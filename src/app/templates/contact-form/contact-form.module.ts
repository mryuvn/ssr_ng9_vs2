import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactFormComponent } from './contact-form.component';

import { RecaptchaModule } from 'angular-google-recaptcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { LocationFinderTemplateModule } from '../location-finder-template/location-finder-template.module';
import { PhoneNumberFormFieldTemplateModule } from '../phone-number-form-field-template/phone-number-form-field-template.module';
import { EmailFormFieldTemplateModule } from '../email-form-field-template/email-form-field-template.module';
import { TemplatesModule } from '../templates.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [ContactFormComponent],
  imports: [
    CommonModule,
    RecaptchaModule,
    FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule,
    LocationFinderTemplateModule,
    PhoneNumberFormFieldTemplateModule,
    EmailFormFieldTemplateModule,
    TemplatesModule,
    PerfectScrollbarModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [ContactFormComponent]
})
export class ContactFormModule { }
