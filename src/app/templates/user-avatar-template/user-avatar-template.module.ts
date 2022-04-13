import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarTemplateComponent } from './user-avatar-template.component';

import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [UserAvatarTemplateComponent],
  imports: [
    CommonModule,
    SafeHtmlModule
  ],
  exports: [UserAvatarTemplateComponent]
})
export class UserAvatarTemplateModule { }
