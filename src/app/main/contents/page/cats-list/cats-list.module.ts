import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = []

import { CatsListComponent } from './cats-list.component';
import { CatItemComponent } from './cat-item/cat-item.component';

import { SafeHtmlModule } from 'src/app/safe-html';
import { AvatarModule } from 'src/app/templates/avatar/avatar.module';
import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [CatsListComponent, CatItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    AvatarModule,
    CarouselModule, WavesModule, ButtonsModule
  ],
  exports: [CatsListComponent]
})
export class CatsListModule { }
