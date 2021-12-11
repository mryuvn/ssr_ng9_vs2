import { Component, Inject, PLATFORM_ID, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostsListComponent implements OnInit {
  subscription : Subscription;

  @Input() dataSource: any;
  @Input() config: any;
  @Input() contentData: any;
  @Input() pageData: any;
  @Input() db_table: string;
  @Input() uploadPath: string;
  @Input() dateFormat: string;
  @Input() langData: any;

  DATA: any = [];
  pagination: any = [];
  currentPage: number = 0;

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.updateModuleData) {
        setTimeout(() => {
          this.renderData();
        }, 1000);
      }

      if (message.text === messageService.messages.updatePageData) {
        setTimeout(() => {
          this.renderData();
        }, 1000);
      }
    });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.renderData();
  }

  renderData() {
    if (this.config && this.dataSource) {
      if (this.config.viewMod === 'pagination') {
        this.renderPaginationData();
      } else {
        this.DATA = this.dataSource;
      }
    }
  }

  renderPaginationData() {
    const pagination = [];
    let items = [];
    const dataLength = this.dataSource.length;
    this.dataSource.forEach((e, index) => {
      items.push(e);
      if (items.length === this.config.perPage) {
        pagination.push(items);
        items = [];
      }
      if (index === (dataLength - 1) && items.length > 0) {
        pagination.push(items);
        items = [];
      }
    });
    this.pagination = pagination;
    if (this.pagination.length > 0) {
      this.DATA = this.pagination[this.currentPage];
    }
  }

  selectPage(data, i) {
    if (this.currentPage !== i) {
      this.currentPage = i;
      this.DATA = data;
    }
  }

  prev() {
    if (this.currentPage > 0) {
      this.currentPage = this.currentPage - 1;
      this.DATA = this.pagination[this.currentPage];
    }
  }

  next() {
    if (this.currentPage < (this.pagination.length - 1)) {
      this.currentPage = this.currentPage + 1;
      this.DATA = this.pagination[this.currentPage];
    }
  }

  firstPage() {
    this.currentPage = 0;
    this.DATA = this.pagination[this.currentPage];
  }

  lastPage() {
    this.currentPage = this.pagination.length - 1;
    this.DATA = this.pagination[this.currentPage];
  }

}
