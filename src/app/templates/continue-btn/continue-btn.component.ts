import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-continue-btn',
  templateUrl: './continue-btn.component.html',
  styleUrls: ['./continue-btn.component.scss']
})
export class ContinueBtnComponent implements OnInit {

  @Input() data: any;
  @Input() color: string;
  @Input() size: string;
  @Input() icon: any;

  @Output() onClick = new EventEmitter();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.data = this.appService.isObject(this.data);
    }

    if (this.icon) {
      if (this.icon === true) {
        this.icon = {
          type: 'fa-icon',
          name: 'fas fa-arrow-right'
        }
      } else {
        this.icon = this.appService.isObject(this.icon);
      }
    }
  }

  doAction(data) {
    if (data.type === 'path') {
      var queryParams = {};
      if (data.queryParams) {
        queryParams = data.queryParams;
      }
      this.router.navigate([data.value], { queryParams: queryParams });
    } else if (data.type === 'action') {
      this.messageService.sendMessage(data.value, null);
    } else {
      //Nothing to do
    }
    this.onClick.emit(data);
  }

}
