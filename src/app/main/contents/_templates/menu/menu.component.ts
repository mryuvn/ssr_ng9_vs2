import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  subscription: Subscription;

  menuData: any;

  path: string;

  constructor(
    private router: Router,
    private appService: AppService,
    private messageService: MessageService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.emitMenuData) {
        this.menuData = message.data;
      }
    });
  }

  ngOnInit(): void {
    this.path = this.router.url;
    
    if (this.appService.menuData && !this.menuData) {
      this.menuData = this.appService.menuData;
    }
  }

  doAction(desData) {
    if (desData.type === 'action') {
      this.messageService.sendMessage(desData.value, null);
    }
  }

}
