import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerTemplateComponent } from './image-viewer-template.component';

import { ImageViewerModule } from 'ng2-image-viewer';

@NgModule({
  declarations: [ImageViewerTemplateComponent],
  imports: [
    CommonModule,
    ImageViewerModule
  ],
  exports: [ImageViewerTemplateComponent]
})
export class ImageViewerTemplateModule { }
