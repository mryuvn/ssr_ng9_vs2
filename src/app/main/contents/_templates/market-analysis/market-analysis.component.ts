import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-market-analysis',
  templateUrl: './market-analysis.component.html',
  styleUrls: ['./market-analysis.component.scss']
})
export class MarketAnalysisComponent implements OnInit {

  lang: string;
  commonData: any = {};

  cat: string = 'market_analysis';
  alias = {
    general: 'general',
    article: 'article'
  }
  tables = {
    cat: '',
    posts: '',
  }

  moduleData: any = {};
  moduleRoute: string;
  uploadPath: string;
  data: any;
  articles: any = [];

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.getLangData();

    this.tables.cat = this.appService.tables.posts.cats;
    this.getModuleData();
  }

  getLangData() {
    this.commonData = this.languageService.getLangData(this.lang);
  }

  getModuleData() {
    this.appService.getSqlData({
      table: this.tables.cat,
      where: 'WHERE alias = "' + this.cat + '" AND enabled = 1'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        if (res.data.length > 0) {
          this.renderModuleData(res.data[0]);
          this.tables.posts = this.moduleData.db_table_basename + 'list';
          this.uploadPath = this.moduleData.db_table_basename.replace(/_/g, "");
          this.getPosts();
        } else {
          console.log('No category with cat = "' + this.cat + '"');
        }
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  renderModuleData(moduleData) {
    moduleData.routes = this.appService.isArray(moduleData.moduleRoutes).data;
    this.moduleData = moduleData;
    this.getModuleRoute();
  }
  
  getModuleRoute() {
    console.log(this.moduleData.routes);
    this.moduleRoute = this.languageService.getLangValue(this.moduleData.routes, this.lang);
    console.log(this.moduleRoute);
    
  }

  getPosts() {
    this.appService.getSqlData({
      table: this.tables.posts,
      where: 'WHERE cat = "' + this.cat + '" AND lang = "' + this.lang + '" AND enabled = 1 AND highlight = 1'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        console.log(res.data);
        res.data.forEach(e => {
          this.renderData(e);
          if (e.alias === this.alias.article) {
            this.articles.push(e);
          }
        });
        this.data = res.data.find(item => item.alias === this.alias.general);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  renderData(e) {
    let path = e.path;
    if (!path) {
      path = this.appService.getLink(e.name);
    }
    e.route = '/' + e.id + '/' + path;
    
    if (e.avatar) {
      e.avatarUrl = this.appService.getFileSrc(e.avatar, this.uploadPath);
    }
    if (e.cover) {
      e.coverUrl = this.appService.getFileSrc(e.cover, this.uploadPath);
    }

    e.JSON = this.appService.isObject(e.jsonData);
    if (e.JSON.continueBtn) {
      e.continueBtn = e.JSON.continueBtn;
    }
  }

}
