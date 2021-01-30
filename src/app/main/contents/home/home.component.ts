import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { SetTagsService } from 'src/app/services/set-tags.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subscription: Subscription;
  socket: any;
  myObserve: any;

  lang: string;
  siteValues: any = {};

  isBrowser: boolean;
  showLazy: Boolean;
  navIsFixed: boolean;

  routerLoaded: boolean;

  constructor(
    private setTagsService: SetTagsService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.getSiteValues();
  }

  getSiteValues() {
    this.siteValues.title = 'Angular 9 SSR application | Home page';
    this.siteValues.description = 'Web application with angular and nguniversal express-engine';
    this.updateTags();
  }

  updateTags() {
    var image = null;
    // image = 'https://' + this.appService.domain + '/' + this.appService.webAvatar;

    const data = {
      title: this.siteValues.title,
      description: this.siteValues.description,
      keywords: this.siteValues.keywords,
      dcTitle: this.siteValues.title,
      image: image,
      type: null
    }
    this.setTagsService.updateTags(data);
  }

}
