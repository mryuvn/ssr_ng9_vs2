import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-fx-economic-calendar',
  templateUrl: './fx-economic-calendar.component.html',
  styleUrls: ['./fx-economic-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FxEconomicCalendarComponent implements OnInit {

  DATA: any;
  dataSource: any = [];
  
  hostname!: string;

  dates: any = [];
  startDate: string;
  endDate: string;
  duration: any = {};

  tabIndex: number = 0;

  collapse: boolean = false;
  expand: boolean = false;
  filterValue!: string;

  loadingData: any;

  isBrowser!: boolean;

  constructor(
    private _app: AppService
  ) { }

  ngOnInit(): void {
    this.hostname = this._app.hostname;
    this.isBrowser = this._app.isBrowser;
    if (this.isBrowser) {
      this.getCollapse();
    }

    const time = new Date();
    const today = this.getDateString(time);
    this.startDate = today;

    const todayValue = new Date(today).getTime();
    const aDay = 1000*60*60*24;
    const endDate = todayValue + aDay * 4;
    this.endDate = this.getDateString(new Date(endDate))
    const to = this.getDateString(new Date((endDate + aDay))); //Cần + 1 ngày cho API lấy dữ liệu

    this.duration = {
      from: today,
      to: to
    }

    //Nghiên cứu lại chỗ này khi truy cập vào giờ chuyển giao sang ngày mới 00:00
    this.loadingData = { loading: true };
    this.getData();

    // if (this.hostname === 'localhost') {
    //   this.fakeData();
    // } else {
    //   this.getData();
    // }
  }

  getDateString(time: Date) {
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
  }

  getCollapse() {
    if (typeof (Storage) !== "undefined") {
      const collapse = localStorage.getItem('fxEcoCalendarCollapse');
      // this.collapse = collapse ? true : false;

      const expand = localStorage.getItem('fxEcoCalendarExpand');
      this.expand = expand ? true : false;
      this.collapse = !expand;
    }
  }

  markCollapse(collapse: boolean) {
    this.expand = !collapse;
    if (typeof (Storage) !== "undefined") {
      // if (collapse) {
      //   localStorage.setItem('fxEcoCalendarCollapse', 'collapse');
      // } else {
      //   localStorage.removeItem('fxEcoCalendarCollapse');
      // }
      if (this.expand) {
        localStorage.setItem('fxEcoCalendarExpand', 'expand');
      } else {
        localStorage.removeItem('fxEcoCalendarExpand');
      }
    }
  }

  getData() {
    const key = 'ulG2hDLLGLLBuiGlSgUkREa6X';
    const symbols = 'USD,JPY,EUR,GBP,AUD,NZD,CAD,CHF';
    const from = this.duration.from;
    const to = this.duration.to;
    // const URL = 'https://fcsapi.com/api-v3/forex/economy_cal?symbol=USD,EUR,JPY&from=2022-05-05&to=2022-05-06&access_key=ulG2hDLLGLLBuiGlSgUkREa6X';
    const URL = 'https://fcsapi.com/api-v3/forex/economy_cal?symbol=' + symbols + '&from=' + from + '&to=' + to + '&access_key=' + key;
    this._app.getAnyApi(URL).subscribe(res => {
      // console.log(res);
      if (res.response) {
        this.DATA = res.response;
        this.renderData();
      } else {
        this.logErr(res, 'getData()');
        this.loadingData = { err: res };
      }
    }, err => {
      this.logErr(err, 'getData()');
      setTimeout(() => {
        this.loadingData = { err: err };
      }, 500);
    });
  }

  fakeData() {
    const DATA: any = [];
    const time = new Date();
    const date = this.getDateString(time);

    for (let index = 0; index < 10; index++) {
      const item: any = {
        "title": "United States-Cattle on Feed", 
        "indicator": "USDA-Cattle Marketed", 
        "country": "US", 
        "currency": "USD", 
        "importance": "3",
        "period": "Oct. 2020", 
        "actual": "1.55", 
        "forecast": "1.45", 
        "previous": "1.36", 
        "scale": "K",
        "source": "Agricul Dept",
        "unit": "Index", 
        "comment": "Construction industry provides information on construction output and activity.Such information gives an insight into the supply on the housing andconstruction market. Rising number of new construction starts or value ofconstruction completed reflects higher consumer and business optimism. Expandingconstruction indicates growth in the housing market and predicts an increase inthe overall economy. However, an excessive supply of new buildings may result ina drop in housing prices. The construction industry is one of the first to gointo a recession when the economy declines but also to recover as conditionsimprove.Statistics of building work approved are compiled from: permits issuedby local government authorities; contracts let or day labour work authorised byCommonwealth, State, semi-government and local government authorities; majorbuilding activity in areas not subject to normal administrative approval e.g.building on remote mine sites.", 
        "date": date + " 20:00:00"
      }
      DATA.push(item);
    }

    const newDate = this.getDateString((new Date((time.getTime() + 1000*60*60*24))))
    for (let index = 0; index < 10; index++) {
      const item: any = {
        "title": "United States-Cattle on Feed", 
        "indicator": "USDA-Cattle Marketed", 
        "country": "US", 
        "currency": "USD", 
        "importance": "3",
        "period": "Oct. 2020", 
        "actual": "1.55", 
        "forecast": "1.45", 
        "previous": "1.36", 
        "scale": "K",
        "source": "Agricul Dept",
        "unit": "Index", 
        "comment": "Construction industry provides information on construction output and activity.Such information gives an insight into the supply on the housing andconstruction market. Rising number of new construction starts or value ofconstruction completed reflects higher consumer and business optimism. Expandingconstruction indicates growth in the housing market and predicts an increase inthe overall economy. However, an excessive supply of new buildings may result ina drop in housing prices. The construction industry is one of the first to gointo a recession when the economy declines but also to recover as conditionsimprove.Statistics of building work approved are compiled from: permits issuedby local government authorities; contracts let or day labour work authorised byCommonwealth, State, semi-government and local government authorities; majorbuilding activity in areas not subject to normal administrative approval e.g.building on remote mine sites.", 
        "date": newDate + " 20:00:00"
      }
      DATA.push(item);
    }

    this.DATA = DATA;
    this.renderData();
  }

  renderData() {
    const dataSource: any = [];

    this.DATA.forEach((e: any) => {
      if (e.country) { e.flagCode = e.country.toLowerCase() };

      e.stars = [
        {
          number: 1,
          enable: false
        }, {
          number: 2,
          enable: false
        }, {
          number: 3,
          enable: false
        }, {
          number: 4,
          enable: false
        }, {
          number: 5,
          enable: false
        }
      ];

      if (e.importance) {
        const importance = parseInt(e.importance);
        e.stars.forEach((star: any) => {
          star.enable = star.number <= importance;
        });
      }

      if (e.date) {
        const dateArr = e.date.split(' ');
        e.dateValue = dateArr[0];
      }

      const index = dataSource.findIndex((item: any) => item.date === e.dateValue);
      if (index === -1) {
        const date = new Date(e.dateValue)
        const item: any = {
          date: e.dateValue,
          time: date.getTime()
        }
        dataSource.push(item);
      }
    });
    // console.log(this.DATA);

    dataSource.forEach((item: any) => {
      item.data = this.DATA.filter((i: any) => i.dateValue === item.date);
    });
    this.dataSource = dataSource;
    // console.log(this.dataSource);

    setTimeout(() => {
      this.loadingData = null;
    }, 300);
  }

  getDuration($event) {
    const start = this.getDateString($event.start);
    const end = this.getDateString($event.end);
    const to = this.getDateString((new Date($event.end.getTime() + 1000*60*60*24)));
    this.duration.from = start;
    this.duration.to = to;

    if (start !== this.startDate || end !== this.endDate) {
      this.duration.searchBtn = true;
    } else {
      this.duration.searchBtn = false;
    }
  }

  reloadData() {
    this.loadingData = { loading: true };

    this.startDate = this.duration.from;
    const endDate = new Date(this.duration.to);
    const endTime = endDate.getTime() - 1000*60*60*24;
    this.endDate = this.getDateString(new Date(endTime));
    this.duration.searchBtn = false;
    this.getData();
    this.tabIndex = 0;
  }

  onTabChanged($event: any) {
    // console.log($event);
  }

  logErr(err: any, funcName: string) {
    this._app.logErr(err, funcName, 'FxEconomicCalendarComponent');
  }

}

@Pipe({
  name: 'searchFilter'
})

export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if(!value)return null;
      if(!args)return value;

      args = args.toLowerCase();

      return value.filter((data: any) => JSON.stringify(data).toLowerCase().includes(args));
  }

}