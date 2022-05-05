import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxEconomicCalendarComponent, SearchFilterPipe } from './fx-economic-calendar.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DateRangeTemplateModule } from 'src/app/templates/date-range-template/date-range-template.module';

@NgModule({
  declarations: [FxEconomicCalendarComponent, SearchFilterPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule, MatTabsModule,
    FormsModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    DateRangeTemplateModule
  ],
  exports: [FxEconomicCalendarComponent]
})
export class FxEconomicCalendarModule { }
