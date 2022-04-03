import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { LayoutService } from 'src/app/services/layout.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  @Input() isBrowser: boolean;

  domainData: any = {};
  siteValues: any = {};

  defaultConfig: any = {
    container: true,
    background: { type: 'primary' },
    color: { type: 'background' },
    bottom: {
      styles: {
        padding: '1rem 0',
        fontSize: '90%'
      },
      logo: {
        position: 'left',
        width: {
          value: 50,
          unit: 'px'
        },
        styles: {}
      },
      siteName: {
        enable: true,
        color: { type: 'warn' },
        styles: {
          fontWeight: 400
        }
      }
    }
  }

  config: any = {
    bottom: {
      logo: {},
      siteName: {}
    }
  };

  constructor(
    public appService: AppService,
    private messageService: MessageService,
    private layoutService: LayoutService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitSiteData) {
        this.domainData = message.data.domainData;
        this.getConfig();
        if (message.data.siteValues) {
          this.siteValues = message.data.siteValues;
        };
      }
    });
  }

  ngOnInit(): void {
    
  }

  getConfig() {
    let config = this.domainData.layoutSettings?.footer;
    if (!config) { config = this.defaultConfig };
    this.layoutService.getElementStyles(config);

    if (!config.bottom) { config.bottom = {} };
    this.layoutService.getElementStyles(config.bottom);

    if (!config.bottom.logo) { config.bottom.logo = this.defaultConfig.bottom.logo };
    this.layoutService.getDefaultLogo(this.domainData, config.bottom.logo);

    this.layoutService.getElementStyles(config.bottom.logo);
    config.bottom.logo.src = this.appService.getFileSrc(config.bottom.logo);
    if (!config.bottom.logo.src) { config.bottom.logo.src = 'assets/imgs/logo/logo.png' };

    if (!config.bottom.siteName) { config.bottom.siteName = {} };
    this.layoutService.getElementStyles(config.bottom.siteName);



    this.config = config;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
