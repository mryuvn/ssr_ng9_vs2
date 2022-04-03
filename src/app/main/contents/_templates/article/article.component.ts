import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FilesService } from 'src/app/services/files.service';
import { PageService } from '../../page/page.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @Input() article: any;

  dataSource: any;

  constructor(
    private appService: AppService,
    private pageService: PageService,
    private filesService: FilesService
  ) { }

  ngOnInit(): void {
    // console.log(this.article);
    const database = this.article.config.database;
    if (database) {
      if (database.type === 'cats' || database.type === 'posts') {
        this.getPosts(database);
      } else if (database.type === 'items') {
        const dataSource = this.article.contents.filter((item: any) => item.enabled);
        if (dataSource.length > 0) {
          dataSource.forEach((e: any, index: number) => {
            e.prodItemID = this.article.cat + '_' + this.article.id + '_item_' + index;
          });
          this.dataSource = dataSource;
        }
      } else {
        this.dataSource = null;
      }
    }
  }

  renderPost(data: any) { //not used
    const avatar = this.appService.isObject(data.avatar).data;
    if (avatar.images) {
      const image = avatar.images[0];
      if (image) {
        image.src = this.appService.getFileSrc(image);
        if (image.type === 'iframe') {
          image.viewImage = true;
        } else {
          if (this.appService.isBrowser) {
            this.filesService.checkImage(image);
          }
        }
        data.image = image;
      }
    }
  }

  getPosts(database: any) {
    let categories: any = [];
    if (database.type === 'cats') {
      database.catArr.forEach((e: any) => {
        const cats = this.pageService.MODULES.filter((i: any) => i.cat === e && i.enabled);
        categories = categories.concat(categories, cats);
      });
    } else {
      database.catArr.forEach((e: any) => {
        const cat = this.pageService.MODULES.find((i: any) => i.id === e && i.enabled);
        categories.push(cat);
      });
    }

    const tables = [];
    categories.forEach((e: any) => {
      const table = this.appService.getPostsTable(e, this.appService.tables.posts.list);
      const index = tables.findIndex((item: any) => item === table);
      if (index === -1) {
        tables.push(table);
      }
    });

    let posts: any = [];
    const renderData = () => {
      const dataSource = [];
      posts.forEach((post: any) => {
        const catData = categories.find((item: any) => item.alias === post.cat);
        if (catData) {
          post.prodItemID = catData.alias + '_' + post.id;
          post.route = '/' + this.appService.sitelang + '/' + catData.route;
          if (database.type === 'posts') {
            const alias = catData.aliasData.find((i: any) => i.name === 'post');
            const getDataBy = alias?.pageConfig?.getData?.where;
            if (getDataBy === 'path') {
              post.route = post.route + '/' + post.path;
            } else {
              const path = post.path ? post.path : this.appService.getLink(post.name);
              post.route = post.route + '/' + post.id + '/' + path;
            }
          }
          if (database.type === 'posts') {
            dataSource.unshift(post);
          } else {
            dataSource.push(post);
          }
        }
      });
      
      this.dataSource = dataSource;
      // console.log(this.dataSource);
    }

    const fields = 'id,cat,alias,lang,avatar,name,caption,price,highlight,enabled';

    let where = 'WHERE enabled = 1 AND lang = "' + this.appService.sitelang + '"';
    const general = this.appService.postAlias.general;
    const post = this.appService.postAlias.post;
    const alias = database.type === 'cats' ? (' AND alias = "' + general + '"') : (' AND alias = "' + post + '"');
    const extension = [];
    database.where.forEach((item: any) => {
      if (item !== 'all') {
        extension.push(' AND ' + item);
      }
    });
    where = where + alias + extension.join('');
    
    const dataLength = tables.length;
    const success = [];
    const errors = [];
    const logErr = (err: any) => this.logErr(err, 'renderCategories()');
    tables.forEach((table: string) => {
      this.appService.getSqlData({
        table: table,
        fields: fields,
        where: where
      }).subscribe(res => {
        if (res.mess === 'ok') {
          posts = posts.concat(posts, res.data);
          success.push(res.data);
          if ((success.length + errors.length) === dataLength) {
            renderData();
            if (errors.length > 0) {
              logErr(errors);
            }
          }
        } else {
          errors.push(res);
          if ((success.length + errors.length) === dataLength) {
            logErr(errors);
            if (success.length > 0) {
              renderData();
            }
          }
        }
      }, err => {
        errors.push(err);
        if ((success.length + errors.length) === dataLength) {
          logErr(errors);
          if (success.length > 0) {
            renderData();
          }
        }
      });
    });
  }

  logErr(err: any, functionName: string) {
    this.appService.logErr(err, functionName, 'ArticleComponent');
  }

}
