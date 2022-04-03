import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { LayoutService } from 'src/app/services/layout.service';
import { MessageService } from 'src/app/services/message.service';
import { PageService } from '../../page/page.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() lang!: string;
  @Input() siteValues: any;

  langsData: any = [
    {
      lang: 'vi'
    },
    {
      lang: 'en'
    }
  ];
  langContent: any = {};

  data: any;
  coverConfig: any = {};
  contentConfig: any = {};

  constructor(
    private appService: AppService,
    private messageService: MessageService,
    private languageService: LanguageService,
    private layoutService: LayoutService,
    private pageService: PageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data;
        this.getLangData();
      }
    });
  }

  ngOnInit(): void {
    this.getLangData();
    this.getData();
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  getData() {
    const moduleAlias = 'contact';
    const moduleData = this.pageService.MODULES.find((e: any) => e.alias === moduleAlias);
    const postAlias = 'article';

    if (moduleData) {
      const renderData = () => {
        let data = this.layoutService.contactData.find((item: any) => item.lang === this.lang && item.enabled);
        if (data) {
          data.avatar = this.appService.isObject(data.avatar).data;
          data.cover = this.appService.isObject(data.cover).data;
          this.layoutService.renderDataImages(data);

          const alias = moduleData.aliasData.find((item: any) => item.name === data.alias);
          let cover = alias?.pageConfig.layout?.cover;
          let content = alias?.pageConfig.layout?.content;
          data.config = this.appService.isObject(data.config).data;
          if (alias.config) {
            if (data.config.cover) { cover = data.config.cover };
            if (data.config.content) { content = data.config.content };
          }
          this.layoutService.getCoverConfig(data, cover);
          this.coverConfig = cover;

          if (content.padding) { content.paddingBottom = content.padding.value + content.padding.unit }
          this.contentConfig = content;
  
          data.contentData = this.appService.isArray(data.contentData).data;
        }
        this.data = data;
      }
  
      if (this.layoutService.contactData) {
        renderData();
      } else {
        const table = this.appService.getPostsTable(moduleData, this.appService.tables.posts.list);
        const fields = '';
        this.appService.getSqlData({
          table: table,
          fields: fields,
          where: 'WHERE cat = "' + moduleAlias + '" AND alias = "' + postAlias + '"'
        }).subscribe(res => {
          if (res.mess === 'ok') {
            this.layoutService.contactData = res.data;
            renderData();
          } else {
            this.appService.logErr(res.err, 'getData()', 'ContactComponent');
          }
        }, err => this.appService.logErr(err, 'getData()', 'ContactComponent'));
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
