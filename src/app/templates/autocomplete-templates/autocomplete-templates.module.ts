import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';

import { SingleAutocompleteComponent } from './single-autocomplete/single-autocomplete.component';
import { StringAutocompleteComponent } from './string-autocomplete/string-autocomplete.component';
import { AvatarModule } from '../avatar/avatar.module';

@NgModule({
  declarations: [SingleAutocompleteComponent, StringAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatIconModule,
    NgxFlagIconCssModule,
    AvatarModule
  ],
  exports: [SingleAutocompleteComponent, StringAutocompleteComponent]
})
export class AutocompleteTemplatesModule { }
