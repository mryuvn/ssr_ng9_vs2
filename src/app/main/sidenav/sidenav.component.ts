import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() open: boolean;
  @Input() siteValues: any;
  @Input() menuData: any;

  @Output() close = new EventEmitter();

  lang: string;
  path: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.path = this.router.url;

    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.path = val.url;
        this.open = false;
      }
    });
  }

  doAction(desData) {
    if (desData.type === 'action') {
      this.messageService.sendMessage(desData.value, null);
      this.open = false;
    }
  }
}
