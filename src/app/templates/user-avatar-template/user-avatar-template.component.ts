import { Component, Inject, PLATFORM_ID, Input, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-user-avatar-template',
  templateUrl: './user-avatar-template.component.html',
  styleUrls: ['./user-avatar-template.component.scss']
})
export class UserAvatarTemplateComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  socket: any;

  @Input() userData: any;
  @Input() width!: number | string;
  @Input() circle!: boolean;

  isBrowser!: boolean;

  avatar: any;
  firstLetter!: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appService: AppService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === socketioService.messages.user.login) {
        setTimeout(() => {
          if (this.userData) { this.checkImage() };
        }, 1000);
      }
    });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkImage();

    if (this.isBrowser) {
      this.socket = this.socketioService.on(this.socketioService.messages.user.login + '_' + this.appService.domain).subscribe(content => {
        setTimeout(() => {
          if (this.userData) { this.checkImage() };
        }, 1000);
      });
    }
  }

  checkImage() {
    const name = this.userData?.nickname ? this.userData.nickname : this.userData?.fullname;
    if (name) { this.firstLetter = name.substr(0, 1) };
    this.avatar = this.userData?.avatar;
    if (this.avatar) {
      if (this.avatar.type !== 'iframe' && this.avatar.src && this.isBrowser) {
        const img = new Image();
        img.src = this.avatar.src;
        img.onload = () => this.avatar.viewImage = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.socket) { this.socket.unsubscribe() };
  }

}
