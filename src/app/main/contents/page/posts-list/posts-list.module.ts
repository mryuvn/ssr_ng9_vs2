import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = []

import { PostsListComponent } from './posts-list.component';
import { PostItemComponent } from './post-item/post-item.component';

import { SafeHtmlModule } from 'src/app/safe-html';
import { AvatarModule } from 'src/app/templates/avatar/avatar.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [PostsListComponent, PostItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    AvatarModule,
    MatButtonModule, MatIconModule, MatRippleModule
  ],
  exports: [PostsListComponent]
})
export class PostsListModule { }
