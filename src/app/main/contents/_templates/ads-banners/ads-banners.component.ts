import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { LayoutService } from 'src/app/services/layout.service';
import { PageService } from '../../page/page.service';

@Component({
  selector: 'app-ads-banners',
  templateUrl: './ads-banners.component.html',
  styleUrls: ['./ads-banners.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdsBannersComponent implements OnInit {

  @Input() enables: any;
  @Input() config: any;

  defaultConfig: any = {
    bannerStyles: {
      background: { type: 'white' },
      styles: {
        boxShadow: '0 2px 7px -5px #000',
        padding: '7px',
        marginBottom: '1.5rem'
      }
    }
  }

  dataSource: any = [];

  constructor(
    private appService: AppService,
    private pageService: PageService,
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    const length = this.enables?.length;
    if (length > 0) {
      this.getConfig();
      if (this.pageService.ADS_BANNERS) {
        this.renderData();
      } else {
        this.getData();
      }
    }
  }

  getConfig() {
    if (!this.config) { this.config = this.defaultConfig };
    if (!this.config.bannerStyles) { this.config.bannerStyles = this.defaultConfig.bannerStyles };
    this.layoutService.getElementStyles(this.config.bannerStyles);
  }

  getData() {
    this.appService.getSqlData({ table: this.appService.tables.adsBanners }).subscribe(res => {
      if (res.mess === 'ok') {
        this.pageService.ADS_BANNERS = res.data;
        this.renderData();
      } else {
        this.appService.logErr(res.err, 'getData()', 'AdsBannersComponent');
      }
    }, err => this.appService.logErr(err, 'getData()', 'AdsBannersComponent'));
  }

  renderData() {
    const enables = this.enables;
    const dataSource: any = [];
    const DATA = this.appService.sortArray(this.pageService.ADS_BANNERS);
    DATA.forEach((e: any) => {
      if (e.enabled) {
        let enable = enables.find((item: any) => item === 'all');
        if (!enable) {
          enable = enables.find((item: any) => item === e.id);
        }
        if (enable) {
          e.pictures = this.appService.isArray(e.pictures).data;
          this.getFileSrc(e);
          e.destination = this.appService.isArray(e.destination).data;
          e.link = this.getLink(e.destination);
          dataSource.push(e);
        }
      }
    });
    this.dataSource = dataSource;
  }

  getFileSrc(e: any) {
    const data = e.pictures.find((item: any) => item.lang === this.appService.sitelang);
    if (data) {
      const image = data.images[0];
      e.src = this.appService.getFileSrc(image);
      e.type = image.type;
    }
  }

  getLink(destination) {
    const data = destination.find((item: any) => item.lang === this.appService.sitelang);
    const link = {
      type: data?.type,
      value: data?.value
    }
    return link;
  }

}
