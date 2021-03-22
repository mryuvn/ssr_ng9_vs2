import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { MessageService } from 'src/app/services/message.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-favorites-menu',
  templateUrl: './favorites-menu.component.html',
  styleUrls: ['./favorites-menu.component.scss']
})
export class FavoritesMenuComponent implements OnInit, OnDestroy {

  @Input() lang: string;
  
  @Output() openTool = new EventEmitter();
  @Output() closeTool = new EventEmitter();

  subscription: Subscription;
  myObserve: any;

  langsData: any = [
    {
      lang: 'vi',
      noData: 'Không có mục được yêu thích nào!',
      likeTitle: 'Bạn đã thích',
      and: 'và',
      otherProduct: 'sản phẩm khác',
      otherProducts: 'sản phẩm khác'
    },
    {
      lang: 'en',
      noData: 'There are no favorite items!',
      likeTitle: 'You have liked',
      and: 'and',
      otherProduct: 'other product',
      otherProducts: 'other products'
    }
  ];
  langContent: any = {};

  dataLength: number = 0;
  favorites: any = [];
  openMenu: boolean;

  product: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private messageService: MessageService,
    private languageService: LanguageService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.sendUserData
        || message.text === messageService.messages.removeUserData
        || message.text === messageService.messages.marks.favorite) {
        this.getFavorites();
      }
    });
  }

  ngOnInit(): void {
    if (!this.lang) {
      this.lang = this.route.snapshot.params.lang;
    }
    
    this.getLangData();

    this.getFavorites();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.openMenu = false;
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
          this.favorites.forEach(item => {
            if (item.data) {
              item.data.nameValue = this.languageService.getLangValue(item.data.name, this.lang);
            }
          });
        }
      }
    });
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  getFavorites() {
    var username = this.appService.userData.username;

    if (typeof (Storage) !== "undefined") {
      if (!username) {
        username = localStorage.getItem('clientUser');
        const isLoged = this.appService.isObject(localStorage.getItem('isLoged'));
        if (isLoged.status === true) {
          username = isLoged.username;
        }
      }
      if (username) {
        const favorites = this.appService.isArray(localStorage.getItem('favorites')).data;
        const thisUserFavorites = favorites.find(item => item.username === username);
        if (thisUserFavorites) {
          const object = this.appService.isObject(thisUserFavorites);
          const array = Object.entries(object);
          const dataSource = [];
          const values = [];
          array.forEach(e => {
            if (e[0] !== 'username') {
              const data = this.appService.isArray(e[1]).data;

              const obj = {
                name: e[0],
                items: data
              }
              if (data.length > 0) {
                dataSource.push(obj);
              }

              data.forEach(item => {
                values.push(item);
              });
            }
          });
          this.favorites = dataSource;
          this.dataLength = values.length;

          this.getProduct();
        }
      }
    }
  }

  getProduct() {
    this.favorites.forEach(item => {
      if (item.name === 'products') {
        const prodID = item.items[0];
        if (prodID) {
          this.appService.getSqlData({
            table: this.appService.tables.products.list,
            where: 'WHERE id = "' + prodID + '"'
          }).subscribe(res => {
            if (res.mess === 'ok') {
              if (res.data.length > 0) {
                const e = res.data[0];
                e.nameValue = this.languageService.getLangValue(e.name, this.lang);
                if (e.avatar) {
                  e.src = this.appService.getFileSrc(e.avatar, this.appService.uploadPaths.products);
                }
                this.product = e;
                if (item.items.length > 2) {
                  e.other = this.langContent.otherProducts;
                } else {
                  e.other = this.langContent.otherProduct;
                }
                item.data = e;
              } else {
                this.product.err = 'Data not found!';
              }
            } else {
              this.product.err = res.err;
              console.log({ res: res, time: new Date() });
            }
          }, err => {
            this.product.err = err;
            console.log({ err: err, time: new Date() });
          });
        }
      }
    });
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
    if (this.openMenu && this.product.err) {
      this.getProduct();
    }
    if (this.openMenu) {
      this.openTool.emit();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.myObserve) {
      this.myObserve.unsubscribe();
    }
  }

}
