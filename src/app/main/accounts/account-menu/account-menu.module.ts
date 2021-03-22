import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { AccountMenuComponent } from './account-menu.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AvatarModule } from 'src/app/templates/avatar/avatar.module';
import { LoginModule } from '../login/login.module';

@NgModule({
  declarations: [AccountMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule, MatTooltipModule,
    AvatarModule,
    LoginModule
  ],
  exports: [AccountMenuComponent]
})
export class AccountMenuModule { }
