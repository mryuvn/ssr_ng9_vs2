import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { CartMenuComponent } from './cart-menu.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarModule } from 'src/app/templates/avatar/avatar.module';

@NgModule({
  declarations: [CartMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule,
    AvatarModule
  ],
  exports: [CartMenuComponent]
})
export class CartMenuModule { }
