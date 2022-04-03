import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessingTemplateComponent } from './processing-template.component';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard'; 

@NgModule({
  declarations: [
    ProcessingTemplateComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    ClipboardModule
  ],
  exports: [ProcessingTemplateComponent]
})
export class ProcessingTemplateModule { }
