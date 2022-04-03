import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { ProductItemComponent } from './product-item/product-item.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarTemplateModule } from 'src/app/templates/avatar-template/avatar-template.module';

@NgModule({
  declarations: [ProductsListComponent, ProductItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule,
    AvatarTemplateModule
  ],
  exports: [ProductsListComponent]
})
export class ProductsListModule { }
