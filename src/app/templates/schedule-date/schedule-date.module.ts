import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatepickerTemplatesModule } from '../datepicker-templates/datepicker-templates.module';

import { ScheduleDateComponent } from './schedule-date.component';

@NgModule({
  declarations: [ScheduleDateComponent],
  imports: [
    CommonModule,
    DatepickerTemplatesModule
  ],
  exports: [ScheduleDateComponent]
})
export class ScheduleDateModule { }
