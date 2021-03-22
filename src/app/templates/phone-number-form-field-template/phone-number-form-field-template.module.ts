import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneNumberFormFieldTemplateComponent } from './phone-number-form-field-template.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AutocompleteTemplatesModule } from '../autocomplete-templates/autocomplete-templates.module';
import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';

@NgModule({
  declarations: [PhoneNumberFormFieldTemplateComponent],
  imports: [
    CommonModule,
    FormsModule, 
    MatFormFieldModule, MatInputModule, MatIconModule, 
    AutocompleteTemplatesModule,
    NgxFlagIconCssModule
  ],
  exports: [PhoneNumberFormFieldTemplateComponent]
})
export class PhoneNumberFormFieldTemplateModule { }
