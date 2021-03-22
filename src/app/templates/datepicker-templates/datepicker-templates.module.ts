import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatepickerTemplatesComponent, CalendarHeader } from './datepicker-templates.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DatepickerTemplatesComponent, CalendarHeader],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  exports: [DatepickerTemplatesComponent],
  entryComponents: [CalendarHeader]
})
export class DatepickerTemplatesModule { }
