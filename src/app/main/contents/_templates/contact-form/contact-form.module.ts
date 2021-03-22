import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutosizeModule } from 'ngx-autosize';
import { AutocompleteTemplatesModule } from 'src/app/templates/autocomplete-templates/autocomplete-templates.module';
import { LocationFinderTemplateModule } from 'src/app/templates/location-finder-template/location-finder-template.module';
import { PhoneNumberFormFieldTemplateModule } from 'src/app/templates/phone-number-form-field-template/phone-number-form-field-template.module';
import { EmailFormFieldTemplateModule } from 'src/app/templates/email-form-field-template/email-form-field-template.module';
import { SafeHtmlModule } from 'src/app/safe-html';

@NgModule({
  declarations: [ContactFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    AutosizeModule,
    AutocompleteTemplatesModule,
    LocationFinderTemplateModule,
    PhoneNumberFormFieldTemplateModule,
    EmailFormFieldTemplateModule,
    SafeHtmlModule
  ],
  exports: [ContactFormComponent]
})
export class ContactFormModule { }
