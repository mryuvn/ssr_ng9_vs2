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
  @Input() siteValues: any = {};
  @Input() menuData: any = [];
  @Input() isBrowser!: boolean;

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
  }

  scrollTo(ID: string) {
    if (this.isBrowser) {
      const el = document.getElementById(ID);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
