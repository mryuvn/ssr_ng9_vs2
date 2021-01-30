import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { SetTagsService } from 'src/app/services/set-tags.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  subscription: Subscription;
  socket: any;
  myObserve: any;

  siteValues: any = {};

  data: any = {};

  constructor(
    private setTagsService: SetTagsService
  ) { }

  ngOnInit(): void {
    this.data.name = 'About us';
    this.siteValues.name = 'Angular 9 SSR application';
    this.siteValues.description = 'Welcome to our wwebsite!';
    this.updateTags();
  }

  updateTags() {
    var title = this.data.title;
    if (!title) { title = this.siteValues.name + ' | ' + this.data.name };

    var description = this.data.description;
    if (!description) { description = this.siteValues.description };

    var keywords = this.data.keywords;
    if (!keywords) { keywords = this.siteValues.keywords };

    var image = null;
    // image = 'https://' + this.appService.domain + '/' + this.appService.webAvatar;
    if (this.data.avatarUrl) {
      if (typeof this.data.avatarUrl === 'string') {
        image = this.data.avatarUrl;
      }
    }

    const data = {
      title: title,
      description: description,
      keywords: keywords,
      dcTitle: title,
      image: image,
      type: null
    }
    this.setTagsService.updateTags(data);
  }

}
