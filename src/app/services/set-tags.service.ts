import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SetTagsService {

  // url: string;

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private dom
  ) { }

  setTags() {
    this.meta.addTags([
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Mr.Yu Design' },
      { property: 'og:type', content: 'article' }
    ]);
  }

  setCanonicalURL(url?: string) {
    const canURL = url == undefined ? this.dom.URL : url;
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }

  setFavicon(data: any) {
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', data.rel);

    if (data.type) { link.setAttribute('type', data.type) };
    if (data.sizes) { link.setAttribute('sizes', data.sizes) };

    this.dom.head.appendChild(link);
    link.setAttribute('href', data.href);
  }

  updateTags(data) {
    if (data.title) {
      this.title.setTitle(data.title);
    }
    
    this.meta.updateTag({ name: 'description', content: data.description });

    // if (data.keywords) {
    //   this.meta.updateTag({ name: 'keywords', content: data.keywords });
    // }

    this.meta.updateTag({ name: 'DC.title', content: data.dcTitle });
    this.meta.updateTag({ property: 'og:url', content: this.dom.URL });

    if (data.type) {
      this.meta.updateTag({ name: 'og:type', content: data.type });
    }

    this.meta.updateTag({ name: 'og:title', content: data.title });
    this.meta.updateTag({ name: 'og:description', content: data.description });

    if (data.image) {
      this.meta.updateTag({ name: 'og:image', content: data.image });
    }

    this.meta.updateTag({ name: 'copyright', content: 'Mr.Yu Design' });
  }

  removeTags() {
    this.meta.removeTag("property='description'");
    // this.meta.removeTag("property='keywords'");
    this.meta.removeTag("property='DC.title'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
  }

}
