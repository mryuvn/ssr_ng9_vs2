import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangeTemplateComponent } from './date-range-template.component';

import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DateRangeTemplateComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule
  ],
  exports: [DateRangeTemplateComponent]
})
export class DateRangeTemplateModule { }
