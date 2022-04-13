import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MenuModule } from '../menu/menu.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { UserAvatarTemplateModule } from 'src/app/templates/user-avatar-template/user-avatar-template.module';
import { AccountModule } from '../account/account.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MenuModule,
    MatButtonModule, MatIconModule, MatMenuModule,
    UserAvatarTemplateModule,
    AccountModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule { }
