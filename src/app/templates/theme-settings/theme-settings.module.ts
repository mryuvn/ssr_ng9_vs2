import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeSettingsComponent } from './theme-settings.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerTemplateModule } from '../color-picker-template/color-picker-template.module';

@NgModule({
  declarations: [ThemeSettingsComponent],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule,
    ColorPickerTemplateModule
  ],
  exports: [ThemeSettingsComponent]
})
export class ThemeSettingsModule { }
