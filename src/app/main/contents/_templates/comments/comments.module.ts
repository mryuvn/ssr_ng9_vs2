import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments.component';
import { WriteCommentFormComponent } from './write-comment-form/write-comment-form.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [];

import { SafeHtmlModule } from 'src/app/safe-html';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutosizeModule } from 'ngx-autosize';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserAvatarTemplateModule } from 'src/app/templates/user-avatar-template/user-avatar-template.module';
import { CmItemComponent } from './cm-item/cm-item.component';

@NgModule({
  declarations: [CommentsComponent, WriteCommentFormComponent, CmItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SafeHtmlModule,
    FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    AutosizeModule,
    MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule,
    UserAvatarTemplateModule
  ],
  exports: [CommentsComponent]
})
export class CommentsModule { }
