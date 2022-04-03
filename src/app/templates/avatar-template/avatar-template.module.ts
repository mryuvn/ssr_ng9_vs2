import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarTemplateComponent } from './avatar-template.component';
import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [AvatarTemplateComponent],
  imports: [
    CommonModule,
    SafeHtmlModule
  ],
  exports: [AvatarTemplateComponent]
})
export class AvatarTemplateModule { }
