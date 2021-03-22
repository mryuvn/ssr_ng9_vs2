import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorDataComponent } from './visitor-data.component';

@NgModule({
  declarations: [VisitorDataComponent],
  imports: [
    CommonModule
  ],
  exports: [VisitorDataComponent]
})
export class VisitorDataModule { }
