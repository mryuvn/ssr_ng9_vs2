import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProcessTemplateComponent } from './process-template/process-template.component';
import { ProgressTemplateComponent } from './progress-template/progress-template.component';
import { LoadingErrorComponent } from './loading-error/loading-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [ProcessTemplateComponent, ProgressTemplateComponent, LoadingErrorComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatIconModule
  ],
  exports: [
    ProcessTemplateComponent, 
    ProgressTemplateComponent,
    LoadingErrorComponent,
    PageNotFoundComponent
  ]
})
export class TemplatesModule { }
