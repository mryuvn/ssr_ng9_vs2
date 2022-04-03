import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CoverDataModule } from '../cover-data/cover-data.module';
import { FormDataModule } from '../form-data/form-data.module';

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule,
    CoverDataModule,
    FormDataModule
  ],
  exports: [ContactComponent]
})
export class ContactModule { }
