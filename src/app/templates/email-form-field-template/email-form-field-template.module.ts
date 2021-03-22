import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailFormFieldTemplateComponent } from './email-form-field-template.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [EmailFormFieldTemplateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule, MatFormFieldModule, MatInputModule
  ],
  exports: [EmailFormFieldTemplateComponent]
})
export class EmailFormFieldTemplateModule { }
