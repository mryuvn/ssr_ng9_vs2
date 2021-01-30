import { Component } from '@angular/core';

import { SetTagsService } from './services/set-tags.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webapp';

  constructor(
    private setTagsService: SetTagsService
  ) {
    setTagsService.setCanonicalURL();
    setTagsService.setTags();
  }
  
}
