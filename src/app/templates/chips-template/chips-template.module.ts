import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import { ChipsTemplateComponent } from './chips-template.component';

@NgModule({
  declarations: [ChipsTemplateComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatChipsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatIconModule
  ],
  exports: [ChipsTemplateComponent]
})
export class ChipsTemplateModule { }
