import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-cource',
  templateUrl: './cource.component.html',
  styleUrls: ['./cource.component.scss']
})
export class CourceComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() data: any;
  @Input() pageTitle: string;
  @Input() table: string;
  @Input() uploadPath: string;
  @Input() contents: any;
  @Input() articles: any;
  @Input() moduleData: any;
  @Input() sameCatsConfig: any;
  @Input() sameCats: any;
  @Input() expandMenuMod: string;
  @Input() isBrowser: boolean;

  @Input() lang: string;
  langsData: any = [
    {
      lang: 'vi',
      price: '',
      register: 'Đăng ký học',
      free: 'Miễn phí',
      lession: 'Bài'
    },
    {
      lang: 'en',
      price: '',
      register: 'Register',
      free: 'Free',
      lession: 'lession'
    }
  ];
  langContent: any = {};
  langData: any = {};
  dateFormat: string;

  lessions: any = [];
  openMenu: number;

  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.updateModuleData || message.text === messageService.messages.updatePageData) {
        setTimeout(() => {
          this.renderLessons();
        }, 1000);
      }
    });
  }

  ngOnInit(): void {
    this.getLangData();

    this.renderLessons();
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.dateFormat = this.langData.dateFormat;
  }

  renderLessons() {
    const lessions = [];
    if (this.moduleData.contentData.parts) {
      this.moduleData.contentData.parts.forEach((e, index) => {
        const items = this.articles.filter(item => item.JSON.part === e.alias);
        let open = false;
        if (this.data.alias === 'general' && index === 0) {
          open = true;
        } else {
          open = items.find(i => i.id === this.data.id) ? true : false;
        }
        const data = {
          alias: e.alias,
          name: e.name,
          items: items,
          open: open
        }
        lessions.push(data);
      });
    }
    this.lessions = lessions;
    // console.log(this.lessions);
  }

  expandMenu(part) {
    if (this.expandMenuMod === 'onlyOne') {
      if (this.openMenu === part.alias) {
        this.openMenu = null;
      } else {
        this.openMenu = part.alias;
      }
      this.lessions.forEach(item => {
        item.open = item.alias === this.openMenu;
      });
    } else {
      part.open = !part.open;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
