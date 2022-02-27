import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
