import { Component, Inject, PLATFORM_ID, OnInit, Input, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AppService } from 'src/app/services/app.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnDestroy {

  @Input() type: string;
  @Input() filename: string;
  @Input() src: any;
  @Input() alt: string;
  @Input() width: string;
  @Input() height: string;
  @Input() shape: string;
  @Input() noImage: string;
  @Input() table: string;
  @Input() updateId: number;
  @Input() uploadPath: string;

  landscape: Boolean;
  ratio: number;
  viewImage: Boolean;

  isBrowser: boolean;
  socket: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appService: AppService,
    private socketioService: SocketioService
  ) { }


  ngOnInit(): void {
    this.isBrowser = true;
    
    if (!this.noImage) {
      this.noImage = 'no-image.jpg';
    }
    
    if (isPlatformBrowser(this.platformId)) {
      if (!this.src) {
        this.src = this.appService.getFileSrc(this.filename, this.uploadPath);
      }
      if (!this.src.type || this.src.type === 'base64') {
        this.checkImage();
      } else {
        this.viewImage = true;
      }

      this.socket = this.socketioService.on(this.socketioService.messages.updateAvatar).subscribe(content => {
        if (this.type === 'avatar' && content.databaseName === this.appService.databaseName && content.table === this.table && content.updateId === this.updateId) {
          this.src = this.appService.getFileSrc(content.avatar, this.uploadPath);
          this.checkImage();
        }
      }, err => console.log({ err: err, table: this.table, postID: this.updateId, time: new Date() }));

      this.socket = this.socketioService.on(this.socketioService.messages.updateCover).subscribe(content => {
        if ( this.type === 'cover' && content.databaseName === this.appService.databaseName && content.table === this.table && content.updateId === this.updateId) {
          this.src = this.appService.getFileSrc(content.cover, this.uploadPath);
          this.checkImage();
        }
      }, err => console.log({ err: err, table: this.table, postID: this.updateId, time: new Date() }));
    }
  }

  checkImage() {
    const img = new Image();
    if (!this.src.type) {
      img.src = this.src;
    } else {
      img.src = this.src.value;
    }
    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight) {
        if (this.shape === 'circle' || this.shape === 'square') {
          this.landscape = true;
        }
      }
      this.ratio = img.naturalHeight / img.naturalWidth * 100;
      if (this.ratio > 100) {
        this.ratio = 100;
      }
      this.viewImage = true;
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
