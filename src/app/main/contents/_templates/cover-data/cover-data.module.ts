import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverDataComponent } from './cover-data.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonTemplateModule } from 'src/app/templates/button-template/button-template.module';
import { AvatarTemplateModule } from 'src/app/templates/avatar-template/avatar-template.module';

@NgModule({
  declarations: [CoverDataComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule,
    ButtonTemplateModule,
    AvatarTemplateModule
  ],
  exports: [CoverDataComponent]
})
export class CoverDataModule { }
