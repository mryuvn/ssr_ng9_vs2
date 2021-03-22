import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  langsData: any = [
    {
      lang: 'vi',
      available: 'Còn',
      notAvailable: 'Hết hàng',
      unlimit: 'Còn hàng',
      pricePer: 'Giá bán theo',
      prod: 'sp',
      order: 'Đặt hàng'
    },
    {
      lang: 'en',
      available: 'Available',
      notAvailable: 'Sold Out',
      unlimit: 'Unlimit',
      pricePer: 'Price er',
      prod: 'pr',
      order: 'Order'
    }
  ];

  public uploadPath: string = 'products';

  constructor(
    private appService: AppService,
    private languageService: LanguageService
  ) { }

  private getLangContent(lang) {
    return this.languageService.getLangContent(this.langsData, lang);
  }

  /**
   * renderData
   */
  public renderData(e, lang) {
    const langContent = this.getLangContent(lang);

    e.avatarUrl = this.appService.getFileSrc(e.avatar, this.uploadPath);
    e.name = this.languageService.getLangValue(e.name, lang);
    e.captionValue = this.languageService.getLangValue(e.caption, lang);
    e.price = this.appService.isObject(e.price);
    if (e.price) {
      const currencySymbol = this.appService.currenciesData.find(item => item.code === e.price.currency);
      if (currencySymbol) {
        e.price.currencySymbol = currencySymbol.symbol;
      } else {
        e.price.currencySymbol = '$';
      }

      var amount = e.price.amount;
      if (!amount) { amount = 0 };
      var taxRate = e.price.taxRate;
      if (!taxRate) { taxRate = 0 };
      e.price.totalPrice = amount + ((amount * taxRate) / 100);
      if (isNaN(e.price.totalPrice)) {
        e.price.totalPrice = 0;
      }

      if (e.price.sellingUnit) {
        if (e.price.sellingUnit.alias && e.price.sellingUnit.alias !== 'custom') {
          e.price.unit = e.price.sellingUnit.alias;
        } else {
          e.price.unit = this.languageService.getLangValue(e.price.sellingUnit.name, lang);
        }
      } else {
        e.price.unit = langContent.prod;
      }

      //PROMOTIONS
      const promotions = this.appService.isArray(e.promotions).data;
      const validPromos = [];
      promotions.forEach(promo => {
        if (promo.duration) {
          promo.namevalue = this.languageService.getLangValue(promo.name, lang);

          promo.details = this.appService.isObject(promo.details);
          if (promo.details.accordingTo === 'priceOnly') {
            promo.priceOnly = promo.details.value;
          } else if (promo.details.accordingTo === 'amount') {
            promo.priceOnly = e.price.amount - promo.details.value;
          } else {
            promo.priceOnly = e.price.amount - ((e.price.amount * promo.details.value) / 100);
          }

          if (promo.details.accordingTo === 'priceOnly') {
            promo.discountValue = e.price.amount - promo.details.value;
          } else {
            promo.discountValue = promo.details.value;
          }

          if (promo.details.accordingTo === 'percent') {
            promo.discountUnit = '%';
          } else {
            const discountUnit = this.appService.currenciesData.find(item => item.code === promo.details.currency);
            if (discountUnit) {
              promo.discountUnit = discountUnit.symbol;
            } else {
              promo.discountUnit = '$';
            }
          }

          promo.duration = this.appService.isObject(promo.duration);
          const start = this.appService.minusDates(new Date(promo.duration.start), new Date());
          const end = this.appService.minusDates(new Date(promo.duration.end), new Date());
          if (!promo.duration.end || end >= 0) {
            if (start <= 0) {
              promo.available = true;
            }
            validPromos.push(promo);
          }
        }
      });
      var arr = validPromos;
      const availablePromos = [];
      validPromos.forEach(e => {
        if (e.available) {
          availablePromos.push(e);
        }
      });
      if (availablePromos.length > 0) {
        arr = availablePromos;
      }
      arr = this.sortPromotions(arr);
      e.promoData = arr.pop();
      //--End PROMOTIONS

      const details = this.appService.isObject(e.details);
      e.marks = this.appService.isObject(details.marks);
      e.available = details.available;
      if (!e.available && e.available !== 0) {
        e.available = 'unlimit';
      }
    }
  }

  /**
   * sortPromotions
   */
  public sortPromotions(array: any[]) {
    const compare = (a, b) => {
      var A = a.priceOnly;
      var B = b.priceOnly;
      let comparison = 0;
      if (A > B) {
        comparison = 1;
      } else if (A < B) {
        comparison = -1;
      }
      return comparison;
    }
    return array.sort(compare);
  }

  /**
   * renderCartItem
   */
  public renderCartItem(item: any) {
    var amount = item.price.amount;
    if (item.promoData) {
      amount = item.promoData.priceOnly;
    }
    const data = {
      number: item.selected,
      id: item.id,
      src: item.avatarUrl,
      name: item.name,
      amount: amount,
      currency: item.price.currency,
      currencySymbol: item.price.currencySymbol
    }
    return data;
  }

}
