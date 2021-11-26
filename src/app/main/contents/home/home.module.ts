import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

import { SafeHtmlModule } from 'src/app/safe-html';
import { MainSliderModule } from '../_templates/main-slider/main-slider.module';
import { MenuModule } from '../_templates/menu/menu.module';
import { AboutModule } from './home_templates/about/about.module';
import { TradeEverywhereModule } from './home_templates/trade-everywhere/trade-everywhere.module';
import { ForexMarketModule } from './home_templates/forex-market/forex-market.module';
import { StartingModule } from './home_templates/starting/starting.module';
import { TradeWithUsModule } from './home_templates/trade-with-us/trade-with-us.module';
import { WhyForexModule } from './home_templates/why-forex/why-forex.module';
import { MarketAnalysisModule } from '../_templates/market-analysis/market-analysis.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SafeHtmlModule,
    MainSliderModule,
    MenuModule,
    AboutModule,
    TradeEverywhereModule,
    ForexMarketModule,
    WhyForexModule,
    StartingModule,
    TradeWithUsModule,
    MarketAnalysisModule
  ]
})
export class HomeModule { }
