import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss']
})
export class CartMenuComponent implements OnInit, OnDestroy {

  @Input() lang: string;

  @Output() openTool = new EventEmitter();
  @Output() closeTool = new EventEmitter();

  subscription : Subscription;
  myObserve: any;
  socket: any;
  
  langsData: any = [
    {
      lang: 'vi',
      shoppingCart: 'Giỏ hàng của bạn',
      noData: 'Không có sản phẩm nào được chọn!',
      totalFare: 'Tạm tính',
      viewCart: 'Xem giỏ hàng',
      payment: 'Thanh toán',
      order: 'Đặt hàng',
      findOrder: 'Tìm kiếm đơn hàng',
      findProds: 'Tìm kiếm sản phẩm'
    },
    {
      lang: 'en',
      shoppingCart: 'Your shopping cart',
      noData: 'No products are selected!',
      totalFare: 'Total',
      viewCart: 'View cart',
      payment: 'Payment',
      order: 'Order',
      findOrder: 'Find your order',
      findProds: 'Find products'
    }
  ];
  langContent: any = {};

  openMenu: boolean;
  
  dataSource: any = [];
  totalFare: number = 0;
  dataLength: number = 0;
  products: any = [];

  userData: any = {};
  username: string;

  path: string;
  moduleRoutes: any = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService,
    private productsService: ProductsService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.marks.addToCart) {
        const newData = message.data;
        this.addToCart(newData);
      }

      if (message.text === messageService.messages.sendUserData
          || message.text === messageService.messages.removeUserData) {
            if (this.lang) {
              this.getCart();
            }
      }

      if (message.text === messageService.messages.marks.updateCart) {
        this.dataSource = message.data;
        appService.myCart = this.dataSource;
        this.countData();
      }
    });
  }

  ngOnInit(): void {
    if (!this.lang) {
      this.lang = this.route.snapshot.params.lang;
    }
    this.getLangData();

    this.path = this.router.url;

    this.getCart();

    this.myObserve = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.path = val.url;
        this.openMenu = false;
        const lang = val.state.root.firstChild.params.lang;
        if (lang !== this.lang) {
          this.lang = lang;
          this.getLangData();
          this.getProducts();
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.socket = this.socketioService.on(this.messageService.messages.marks.addToCart).subscribe(content => {
        if (content.username === this.username && content.userLevel === this.userData.userLevel) {
          this.addToCart(content.newData);
          this.messageService.sendMessage(this.messageService.messages.marks.updateOrder, this.dataSource);
        }
      }, err => console.log({ err: err, time: new Date() }));

      this.socket = this.socketioService.on(this.messageService.messages.marks.updateCart).subscribe(content => {
        if (content.username === this.username && content.userLevel === this.userData.userLevel) {
          this.dataSource = content.data;
          this.countData();
          this.messageService.sendMessage(this.messageService.messages.marks.updateOrder, this.dataSource);
        }
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.moduleRoutes = this.appService.getModuleRoute(this.lang);
  }

  addToCart(newData) {
    this.dataSource = this.appService.myCart;
    this.countData();
  }

  getCart() {
    this.userData = this.appService.userData;
    this.username = this.userData.username;
    if (typeof (Storage) !== "undefined") {
      if (!this.username) {
        this.username = localStorage.getItem('clientUser');
        const isLoged = this.appService.isObject(localStorage.getItem('isLoged'));
        if (isLoged.status === true) {
          this.username = isLoged.username;
        }
      }
      if (this.username) {
        const shoppingCart = this.appService.isArray(localStorage.getItem('shoppingCart')).data;
        const thisUserCart = shoppingCart.find(item => item.username === this.username);
        if (thisUserCart) {
          this.dataSource = this.appService.isArray(thisUserCart.dataSource).data;
        } else {
          this.dataSource = [];
          this.totalFare = 0;
          this.dataLength = 0;
        }
        this.appService.myCart = this.dataSource;
        this.countData();
        this.getProducts();
      }
    }
  }

  getProducts() {
    if (this.dataSource.length > 0 && this.products.length === 0) {
      var where = 'WHERE id = "' + this.dataSource[0].id + '"';
      const whereArr = [];
      this.dataSource.forEach((e, index) => {
        if (index > 0) {
          const item = 'OR id = "' + e.id + '"';
          whereArr.push(item);
        }
      });
      where = where + ' ' + whereArr.join(' ');

      this.appService.getSqlData({
        table: this.appService.tables.products.list,
        where: where
      }).subscribe(res => {
        if (res.mess === 'ok') {
          this.products = res.data;
          this.renderProduct();
        } else {
          console.log({ res: res, time: new Date() });
        }
      }, err => console.log({ err: err, time: new Date() }));
    }
  }

  renderProduct() {
    const dataSource = [];
    this.products.forEach(e => {
      if (e.enabled) {
        this.productsService.renderData(e, this.lang);
        const data = this.productsService.renderCartItem(e);
        const item = this.dataSource.find(i => i.id === data.id);
        if (item) {
          data.number = item.number;
        }
        dataSource.push(data);
      }
    });
    this.dataSource = dataSource;
    this.appService.myCart = this.dataSource;
    this.countData();
  }

  countData() {
    const amounts = [];
    const numbers = [];
    this.dataSource.forEach(e => {
      const amount = e.number * e.amount;
      amounts.push(amount);
      numbers.push(e.number);
    });
    this.totalFare = this.appService.sumArray(amounts);
    this.dataLength = this.appService.sumArray(numbers);
  }

  minus(item, index) {
    if (item.number > 0) {
      item.number = item.number - 1;
    }
    this.countData();
    this.storagedData();
  }

  add(item) {
    item.number = item.number + 1;
    this.countData();
    this.storagedData();
  }

  remove(index) {
    this.dataSource.splice(index, 1);
    this.countData();
    this.storagedData();
  }

  storagedData() {
    this.appService.myCart = this.dataSource;
    if (typeof (Storage) !== "undefined") {
      const shoppingCart = this.appService.isArray(localStorage.getItem('shoppingCart')).data;
      shoppingCart.forEach(e => {
        if (e.username === this.username) {
          e.dataSource = this.dataSource;
        }
      });
      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    }

    this.messageService.sendMessage(this.messageService.messages.marks.updateOrder, this.dataSource);

    const emitData = {
      message: this.messageService.messages.marks.updateCart,
      emit: false,
      broadcast: true,
      content: {
        username: this.username,
        userLevel: this.userData.userLevel,
        data: this.dataSource
      }
    }
    this.socketioService.emit("client_emit", emitData);
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
    if (this.openMenu) {
      this.openTool.emit();
    }
  }

  order() {
    const route = '/' + this.lang + '/' + this.appService.getModuleRoute(this.lang).order;
    const queryParams = {
      dataSource: this.dataSource
    }
    this.closeTool.emit();
    this.router.navigate([route], {state: queryParams});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.myObserve) {
      this.myObserve.unsubscribe();
    }
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
