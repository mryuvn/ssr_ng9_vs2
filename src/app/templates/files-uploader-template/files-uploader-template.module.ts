import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesUploaderTemplateComponent } from './files-uploader-template.component';

import { NgxUploaderModule } from 'ngx-uploader';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [FilesUploaderTemplateComponent],
  imports: [
    CommonModule,
    NgxUploaderModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatTabsModule, MatCheckboxModule
  ],
  exports: [FilesUploaderTemplateComponent]
})
export class FilesUploaderTemplateModule { }
