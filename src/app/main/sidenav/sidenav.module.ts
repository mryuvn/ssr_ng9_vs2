import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SidenavComponent } from './sidenav.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'src/app/templates/avatar/avatar.module';
import { ContinueBtnModule } from 'src/app/templates/continue-btn/continue-btn.module';
import { IconModule } from 'src/app/templates/icon/icon.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule, MatMenuModule,
    AvatarModule,
    ContinueBtnModule,
    IconModule,
    PerfectScrollbarModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [SidenavComponent]
})
export class SidenavModule { }
