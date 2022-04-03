import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDataComponent } from './form-data.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AutosizeModule } from 'ngx-autosize';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmailTemplateModule } from 'src/app/templates/email-template/email-template.module';
import { PhoneNumberTemplateModule } from 'src/app/templates/phone-number-template/phone-number-template.module';
import { ProcessingTemplateModule } from 'src/app/templates/processing-template/processing-template.module';

@NgModule({
  declarations: [FormDataComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatRadioModule,
    AutosizeModule,
    MatButtonModule, MatIconModule,
    EmailTemplateModule, PhoneNumberTemplateModule,
    ProcessingTemplateModule
  ],
  exports: [FormDataComponent]
})
export class FormDataModule { }
