import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumViewerTemplateComponent } from './album-viewer-template.component';
import { ImageViewerTemplateModule } from '../image-viewer-template/image-viewer-template.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AlbumViewerTemplateComponent],
  imports: [
    CommonModule,
    ImageViewerTemplateModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatTooltipModule, MatMenuModule
  ],
  exports: [AlbumViewerTemplateComponent]
})
export class AlbumViewerTemplateModule { }
