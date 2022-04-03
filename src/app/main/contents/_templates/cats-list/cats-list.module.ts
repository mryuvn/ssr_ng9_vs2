import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatsListComponent } from './cats-list.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { ProductsListModule } from '../products-list/products-list.module';

@NgModule({
  declarations: [CatsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProductsListModule
  ],
  exports: [CatsListComponent]
})
export class CatsListModule { }
