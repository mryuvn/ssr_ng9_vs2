import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationFinderTemplateComponent } from './location-finder-template.component';

import { AutocompleteTemplatesModule } from '../autocomplete-templates/autocomplete-templates.module';

@NgModule({
  declarations: [LocationFinderTemplateComponent],
  imports: [
    CommonModule,
    AutocompleteTemplatesModule
  ],
  exports:[LocationFinderTemplateComponent]
})
export class LocationFinderTemplateModule { }
