import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { CoverDataModule } from '../cover-data/cover-data.module';
import { ProductsListModule } from '../products-list/products-list.module';

@NgModule({
  declarations: [ArticleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoverDataModule,
    ProductsListModule
  ],
  exports: [ArticleComponent]
})
export class ArticleModule { }
