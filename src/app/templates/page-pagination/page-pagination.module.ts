import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagePaginationComponent } from './page-pagination.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PagePaginationComponent],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule
  ],
  exports: [PagePaginationComponent]
})
export class PagePaginationModule { }
