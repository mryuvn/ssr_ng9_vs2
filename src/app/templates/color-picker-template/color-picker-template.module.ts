//PACKAGES: npm install --save ngx-color-picker hex-and-rgba invert-color

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorPickerTemplateComponent } from './color-picker-template.component';
import { ColorPickerButtonComponent } from './color-picker-button/color-picker-button.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [ColorPickerTemplateComponent, ColorPickerButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    ColorPickerModule,
    MatTabsModule
  ],
  exports: [ColorPickerTemplateComponent]
})
export class ColorPickerTemplateModule { }
