import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { ToolbarComponent } from './toolbar.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { NgxFlagIconCssModule } from 'ngx-flag-icon-css';
import { IconModule } from '../../templates/icon/icon.module';
import { ContinueBtnModule } from '../../templates/continue-btn/continue-btn.module';
import { AccountMenuModule } from '../accounts/account-menu/account-menu.module';
import { CartMenuModule } from '../tools/cart-menu/cart-menu.module';
import { FavoritesMenuModule } from '../tools/favorites-menu/favorites-menu.module';
import { NotificationsModule } from '../tools/notifications/notifications.module';
import { DataSearchModule } from '../contents/_templates/data-search/data-search.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule, MatMenuModule,
    NgxFlagIconCssModule,
    IconModule,
    ContinueBtnModule,
    AccountMenuModule,
    CartMenuModule,
    FavoritesMenuModule,
    NotificationsModule,
    DataSearchModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule { }
