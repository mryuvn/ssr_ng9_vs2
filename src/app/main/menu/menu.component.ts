import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  @Input() position: string;
  @Input() navIsFixed: boolean;
  @Input() config: any;
  @Input() isBrowser!: boolean;
  
  @Input() siteValues: any;
  @Input() menuData: any;

  menuItemStyles: any;

  constructor(
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitSiteData) {
        if (message.data.menu) { this.menuData = message.data.menu };
        if (message.data.siteValues) { this.siteValues = message.data.siteValues };
      }
    });
  }

  ngOnInit(): void {
    // console.log(this.config);
  }

  scrollTo(ID: string) {
    if (this.isBrowser && ID) {
      const el = document.getElementById(ID);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
