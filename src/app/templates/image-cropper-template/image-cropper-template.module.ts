import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageCropperTemplateComponent } from './image-cropper-template.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ImageCropperTemplateComponent],
  imports: [
    CommonModule,
    ImageCropperModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatSliderModule, MatFormFieldModule, MatInputModule
  ],
  exports: [ImageCropperTemplateComponent]
})
export class ImageCropperTemplateModule { }
