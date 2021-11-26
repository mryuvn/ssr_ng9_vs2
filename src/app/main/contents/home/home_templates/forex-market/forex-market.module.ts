import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForexMarketComponent } from './forex-market.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContinueBtnModule } from 'src/app/templates/continue-btn/continue-btn.module';
import { IconModule } from 'src/app/templates/icon/icon.module';

@NgModule({
  declarations: [ForexMarketComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule,
    ContinueBtnModule,
    IconModule
  ],
  exports: [ForexMarketComponent]
})
export class ForexMarketModule { }
