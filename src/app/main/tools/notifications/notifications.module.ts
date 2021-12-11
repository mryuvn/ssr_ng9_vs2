import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { NotificationsComponent } from './notifications.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule
  ],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
