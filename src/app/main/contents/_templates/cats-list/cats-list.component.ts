import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FilesService } from 'src/app/services/files.service';
import { PageService } from '../../page/page.service';

@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrls: ['./cats-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatsListComponent implements OnInit {

  @Input() catArr: any;
  @Input() config: any;
  @Input() className!: string;
  @Input() activeID!: number;

  DATA: any = [];
  dataSource: any;

  type!: string;

  constructor(
    private appService: AppService,
    private pageService: PageService,
    private filesService: FilesService
  ) { }

  ngOnInit(): void {
    // console.log(this.catArr);
    // console.log(this.config);
    
    this.type = this.config?.type;
    this.getPosts();
  }

  getPosts() {
    const lang = this.appService.sitelang;

    const arr: any = [];
    this.catArr.forEach((e: any) => {
      if (e.enabled) {
        const table = this.appService.getPostsTable(e, this.appService.tables.posts.list);
  
        const item = arr.find((i: any) => i.table === table);
        if (item) {
          item.cats.push(e.alias)
        } else {
          arr.push({
            table: table,
            cats: [e.alias]
          });
        }
      }
    });
    // console.log(arr);

    const general = this.appService.postAlias.general;
    const post = this.appService.postAlias.post;
    const dataSource: any = [];
    const renderData = (posts: any) => {
      this.catArr.forEach((e: any) => {
        if (e.enabled) {
          const moduleRoute = '/' + lang + '/' + e.route;
          if (this.type === 'menu') {
            e.posts = posts.filter((item: any) => item.alias === post && item.cat === e.alias);
            const alias = e.aliasData.find((i: any) => i.name === post);
            const where = alias?.pageConfig?.getData?.where;
            e.posts.forEach((item: any) => {
              item.prodItemID = e.table_name + item.id;
              const pageID = where === 'path' ? item.path : item.id;
              item.route = moduleRoute + '/' + pageID;
              if (where !== 'path') {
                const path = item.path ? item.path : this.appService.getLink(item.name);
                item.route = item.route + '/' + path;
              }
            });
            dataSource.push(e);
          } else {
            const data = posts.find((item: any) => item.alias === general && item.cat === e.alias);
            if (data) {
              data.prodItemID = e.table_name + data.id;
              data.route = moduleRoute;
              dataSource.push(data);
            }
          }
        }
      });
      this.dataSource = dataSource;
      // console.log(this.className);
      // console.log(dataSource);
    }

    const fields = 'id,cat,alias,lang,avatar,name,caption,price,highlight,enabled';
    
    let where = 'WHERE lang = "' + lang + '" AND enabled = 1';
    // where = 'WHERE alias = "' + general + '" AND lang = "' + lang + '" AND enabled = 1';
    
    let DATA: any = [];
    const dataLength = arr.length;
    const success = [];
    const errors = [];
    arr.forEach((e: any) => {
      const getWhere = () => {
        const whereArr = [];
        e.cats.forEach((alias: string, index: number) => {
          const item = 'cat = "' + alias + '"';
          if (index === 0) {
            const where = 'WHERE ' + item;
            whereArr.push(where);
          } else {
            const where = 'OR ' + item;
            whereArr.push(where);
          }
        });
        const where = whereArr.join(' ');
        return where;
      }
      // const where = getWhere();
      // console.log(where);
      
      this.appService.getSqlData({
        table: e.table,
        fields: fields,
        where: where
      }).subscribe(res => {
        if (res.mess === 'ok') {
          DATA = DATA.concat(DATA, res.data);
          success.push(res.data);
          if ((success.length + errors.length) === dataLength) {
            renderData(DATA);
            if (errors.length > 0) {
              this.appService.logErr(errors, 'getPosts()', 'CatsListComponent');
            }
          }
        } else {
          errors.push(res);
          if ((success.length + errors.length) === dataLength) {
            this.appService.logErr(errors, 'getPosts()', 'CatsListComponent');
            if (success.length > 0) {
              renderData(DATA);
            }
          }
        }
      }, err => {
        errors.push(err);
        if ((success.length + errors.length) === dataLength) {
          this.appService.logErr(errors, 'getPosts()', 'CatsListComponent');
          if (success.length > 0) {
            renderData(DATA);
          }
        }
      });
    });
  }

}
