import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSearchComponent } from './data-search.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [DataSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, MatIconModule
  ],
  exports: [DataSearchComponent]
})
export class DataSearchModule { }
