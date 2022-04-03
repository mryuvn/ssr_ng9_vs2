import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponent } from './page.component';
import { WebDomainsComponent } from './web-domains/web-domains.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: PageComponent
  },
  {
    path: ':moduleRoute',
    component: PageComponent
  },
  {
    path: ':moduleRoute/:pageID',
    component: PageComponent
  },
  {
    path: ':moduleRoute/:pageID/:path',
    component: PageComponent
  }
];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';

import { ButtonTemplateModule } from 'src/app/templates/button-template/button-template.module';
import { AvatarTemplateModule } from 'src/app/templates/avatar-template/avatar-template.module';


import { CoverDataModule } from '../_templates/cover-data/cover-data.module';
import { ArticleModule } from '../_templates/article/article.module';
import { CatsListModule } from '../_templates/cats-list/cats-list.module';
import { ContactModule } from '../_templates/contact/contact.module';
import { ProductsListModule } from '../_templates/products-list/products-list.module';
import { AdsBannersModule } from '../_templates/ads-banners/ads-banners.module';
import { FormDataModule } from '../_templates/form-data/form-data.module';
import { CommentsModule } from '../_templates/comments/comments.module';
import { FaqsModule } from '../_templates/faqs/faqs.module';

@NgModule({
  declarations: [PageComponent, WebDomainsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MatButtonModule, MatIconModule, MatMenuModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule,
    CarouselModule, WavesModule, ButtonsModule,
    ButtonTemplateModule,
    AvatarTemplateModule,
    CoverDataModule,
    ArticleModule,
    CatsListModule,
    ProductsListModule,
    ContactModule,
    AdsBannersModule,
    FormDataModule,
    CommentsModule,
    FaqsModule
  ]
})
export class PageModule { }
