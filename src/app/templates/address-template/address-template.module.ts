import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressTemplateComponent } from './address-template.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AutocompleteTemplatesModule } from '../autocomplete-templates/autocomplete-templates.module';

@NgModule({
  declarations: [AddressTemplateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    AutocompleteTemplatesModule
  ],
  exports: [AddressTemplateComponent]
})
export class AddressTemplateModule { }
