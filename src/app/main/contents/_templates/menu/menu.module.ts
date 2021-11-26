import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from 'src/app/templates/icon/icon.module';
import { ContinueBtnModule } from 'src/app/templates/continue-btn/continue-btn.module';


@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule, MatMenuModule,
    IconModule,
    ContinueBtnModule
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
