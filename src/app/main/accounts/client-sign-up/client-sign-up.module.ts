import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { ClientSignUpComponent } from './client-sign-up.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PhoneNumberFormFieldTemplateModule } from 'src/app/templates/phone-number-form-field-template/phone-number-form-field-template.module';
import { EmailFormFieldTemplateModule } from 'src/app/templates/email-form-field-template/email-form-field-template.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [ClientSignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule,
    PhoneNumberFormFieldTemplateModule,
    EmailFormFieldTemplateModule
  ],
  exports: [ClientSignUpComponent]
})
export class ClientSignUpModule { }
