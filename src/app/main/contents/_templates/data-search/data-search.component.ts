import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.scss']
})
export class DataSearchComponent implements OnInit {

  @Input() ID: string;

  @Output() closeForm = new EventEmitter();

  myObserve: any;

  lang: string;
  langsData: any = [
    {
      lang: 'vi',
      placeholder: 'Tìm kiếm...'
    },
    {
      lang: 'en',
      placeholder: 'Search...'
    }
  ];
  langContent: any = {};

  searchKey: string = '';
  alias: string = 'search';
  modules: any = [];

  loadingData = {
    loading: false,
    err: null
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.lang = this.route.snapshot.params.lang;
    this.getLangData();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
        }
      }
    });
  }
  
  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  focus() {
    const id = 'dataSearchInput_' + this.ID;
    const el = this.document.getElementById(id) as HTMLElement;
    setTimeout(() => {
      if (el) {
        el.focus();
      }
    }, 1);
  }

  search(string: string) {
    // console.log(string);
    if (!this.loadingData.loading) {
      this.loadingData.loading = true;
      this.getModules();
    }
  }

  getModules() {
    this.appService.getSqlData({
      table: this.appService.tables.posts.cats,
      where: 'WHERE enabled = 1'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        const modules = res.data;
        const db_tables = [];
        modules.forEach(m => {
          m.route = this.languageService.getLangValue(m.moduleRoutes, this.lang);
          m.config = this.appService.isObject(m.moduleConfig);
          const rs = db_tables.find(item => item === m.db_table_basename);
          if (!rs) {
            db_tables.push(m.db_table_basename);
          }
        });
        this.modules = modules;
        this.getPosts(db_tables);
      } else {
        console.log({ res: res, time: new Date() });

      }
    }, err => {
      console.log({ err: err, time: new Date() });

    });
  }

  getPosts(db_tables) {
    // console.log(db_tables);
    const dataLength = db_tables.length;
    const success = [];
    const errors = [];
    db_tables.forEach(table => {
      this.appService.getSqlData({
        table: table + 'list',
        where: 'WHERE enabled = 1 AND lang = "' + this.lang + '"'
      }).subscribe(res => {
        if (res.mess === 'ok') {
          success.push(res.data);
          if ((success.length + errors.length) === dataLength) {
            this.findData(success);
            if (errors.length > 0) {
              console.log({ errors: errors, time: new Date() });
            }
          }
        } else {
          console.log({ res: res, time: new Date() });
          errors.push(res);
          if ((success.length + errors.length) === dataLength) {
            console.log({ errors: errors, time: new Date() });
            if (success.length > 0) {
              this.findData(success);
            }
          }
        }
      }, err => {
        console.log({ err: err, time: new Date() });
        errors.push(err);
        if ((success.length + errors.length) === dataLength) {
          console.log({ errors: errors, time: new Date() });
          if (success.length > 0) {
            this.findData(success);
          }
        }
      });
    });
  }

  findData(DATA) {
    // console.log(DATA);
    const renderPost = (post) => {
      const moduleData = this.modules.find(m => m.alias === post.cat);
      if (moduleData) {
        const uploadPath = moduleData.db_table_basename.replace(/_/g, "");
        this.appService.renderPageData(post, uploadPath);

        post.route = '/' + this.lang + '/' + moduleData.route;
        if (post.alias !== 'general') {
          if (moduleData.config.getDataBy === 'path') {
            post.route = post.route + '/' + post.path;
          } else {
            let path = post.path;
            if (!path) {
              path = this.appService.getLink(post.name);
              post.route = post.route + '/' + post.id + '/' + path;
            }
          }
        }
      }
    }

    const posts = [];
    const key = this.appService.getStringtify(this.searchKey);
    DATA.forEach(e => {
      e.forEach(item => {
        if (item.cat !== this.alias && item.cat !== 'home_page') {
          const name = this.appService.getStringtify(item.name);
          if (name.indexOf(key) !== -1) {
            renderPost(item);
            posts.push(item);
          }

          if (item.keywords) {
            const rs = posts.find(i => i.id === item.id);
            if (!rs) {
              const keyword = this.appService.getStringtify(item.keywords);
              if (keyword.indexOf(key) !== -1) {
                renderPost(item);
                posts.push(item);
              }
            }
          }
        }
      });
    });
    console.log(posts);

    const searchModule = this.modules.find(item => item.alias === this.alias);
    if (searchModule) {
      const moduleData = this.appService.isArray(searchModule.moduleData).data;
      let moduleContent = this.languageService.getLangValue(moduleData, this.lang);
      moduleContent = this.appService.isObject(moduleContent);
      let mess: string = null;
      const results = posts.length;
      if (results > 0) {
        mess = moduleContent.found + ' <b>' + results + '</b> ' + moduleContent.matching + ' "<b>' + this.searchKey + '</b>"';
      } else {
        mess = moduleContent.notFound + ' "<b>' + this.searchKey + '</b>"';
      }
      const routeData = {
        mess: mess,
        articles: posts
      }

      const route = '/' + this.lang + '/' + searchModule.route;
      if (route !== this.router.url) {
        this.router.navigate([route], { state: routeData });
      } else {
        this.messageService.sendMessage(this.messageService.messages.emitDataSearchResult, routeData);
      }

      this.close();
    } else {
      this.loadingFail();
    }
  }

  loadingFail() {
    console.log('loadingFail()');
    
  }

  close() {
    setTimeout(() => {
      this.searchKey = '';
      this.loadingData.loading = false;
      this.loadingData.err = null;
      this.closeForm.emit();
    }, 1);
  }

}
