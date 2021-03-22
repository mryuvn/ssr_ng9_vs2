import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactItemComponent } from './contact-item.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ContactItemComponent],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule
  ],
  exports: [ContactItemComponent]
})
export class ContactItemModule { }
