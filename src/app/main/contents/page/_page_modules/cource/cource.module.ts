import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { CourceComponent } from './cource.component';

import { SafeHtmlModule } from 'src/app/safe-html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarModule } from 'src/app/templates/avatar/avatar.module';
import { ContinueBtnModule } from 'src/app/templates/continue-btn/continue-btn.module';
import { IconModule } from 'src/app/templates/icon/icon.module';
import { CatsListModule } from '../../cats-list/cats-list.module';

@NgModule({
  declarations: [CourceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule,
    AvatarModule,
    ContinueBtnModule,
    IconModule,
    CatsListModule
  ],
  exports: [CourceComponent]
})
export class CourceModule { }
