import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateComponent } from './email-template.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    EmailTemplateComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule,
    FormsModule, MatFormFieldModule, MatInputModule
  ],
  exports: [EmailTemplateComponent]
})
export class EmailTemplateModule { }
