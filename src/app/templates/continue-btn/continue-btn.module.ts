import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { ContinueBtnComponent } from './continue-btn.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [ContinueBtnComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule,
    IconModule
  ],
  exports: [ContinueBtnComponent]
})
export class ContinueBtnModule { }
