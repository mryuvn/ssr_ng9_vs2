import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneNumberTemplateComponent } from './phone-number-template.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 


@NgModule({
  declarations: [
    PhoneNumberTemplateComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule
  ],
  exports: [PhoneNumberTemplateComponent]
})
export class PhoneNumberTemplateModule { }
