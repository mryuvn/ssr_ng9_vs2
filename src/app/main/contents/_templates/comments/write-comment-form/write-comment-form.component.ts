import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { AppService } from 'src/app/services/app.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-write-comment-form',
  templateUrl: './write-comment-form.component.html',
  styleUrls: ['./write-comment-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WriteCommentFormComponent implements OnInit {

  @Input() commonData: any;
  @Input() langContent: any;
  @Input() config: any;
  @Input() userData: any;

  @Output() emitData = new EventEmitter();

  defaultConfig: any = {
    appearance: 'outline',
    floatLabel: 'auto',
    submit: {
      icon: '<i class="fas fa-paper-plane"></i>',
      iconOnly: false,
      background: { type: 'accent' },
      color: { type: 'white' },
      styles: {
        height: '40px'
      }
    }
  }

  content: string = '';

  constructor(
    private appService: AppService,
    private layoutService: LayoutService,
    private socketioService: SocketioService
  ) { }

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig() {
    if (!this.config) { this.config = this.defaultConfig };
    if (!this.config.appearance) { this.config.appearance = this.defaultConfig.appearance };
    if (!this.config.floatLabel) { this.config.floatLabel = this.defaultConfig.floatLabel };
    if (!this.config.submit) { this.config.submit = this.defaultConfig.submit };
    this.layoutService.getElementStyles(this.config.submit);
  }

  submit() {
    const data = {
      content: this.content,
      userData: {
        username: this.userData.username,
        nickname: this.userData.nickname,
        fullname: this.userData.fullname,
        avatar: this.userData.avatar,
        avatarUrl: this.userData.avatarUrl,
        userLevel: this.userData.userLevel
      },
      createdTime: new Date()
    }

    this.emitData.emit(data);

    const dataEmit = {
      message: this.socketioService.messages.webComment.write + '_' + this.appService.domain,
      emit: false,
      broadcast: true,
      content: {
        data: data
      }
    }
    this.socketioService.emit('client_emit', dataEmit);

    setTimeout(() => {
      this.content = '';
    }, 1);
    
  }
}
