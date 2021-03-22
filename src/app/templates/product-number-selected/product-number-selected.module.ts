import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductNumberSelectedComponent } from './product-number-selected.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ProductNumberSelectedComponent],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule
  ],
  exports: [ProductNumberSelectedComponent]
})
export class ProductNumberSelectedModule { }
