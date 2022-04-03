import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FilesService } from 'src/app/services/files.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() lang!: string;
  @Input() pageData: any;

  socket: any;
  
  commonData: any = {};
  langsData: any = [
    {
      lang: 'vi',
      passersby: 'Khách vãng lai',
      writeComment: {
        label: 'Viết bình luận',
        placeholder: 'Nhập nội dung của bạn...',
        send: 'Gửi',
        upload: {
          tooltip: 'Ảnh/Video',
          title: 'Tải lên ảnh/video'
        },
        link: {
          tooltip: 'Chèn link',
          title: 'Chèn link'
        }
      },
      like: 'Thích',
      reply: 'Trả lời',
      readMore: 'Xem thêm',
      hideAway: 'Ẩn bớt'
    },
    {
      lang: 'en',
      passersby: 'Passersby',
      writeComment: {
        label: 'Write comment',
        placeholder: 'Type your comment...',
        send: 'Send',
        upload: {
          tooltip: 'Pictures/Videos',
          title: 'Upload pictures/videos'
        },
        link: {
          tooltip: 'Insert link',
          title: 'Insert link'
        }
      },
      like: 'Like',
      reply: 'Reply',
      readMore: 'Read more',
      hideAway: 'Hide away'
    }
  ];
  langContent: any = {};
  dateFormat!: string;

  userData: any = {};

  dataSource: any = [];

  emojis: any = [
    {
      value: 'favorite',
      matIcon: 'favorite',
      // faIcon: 'fas fa-heart',
      title: [
        {
          lang: 'vi',
          content: 'Yêu mến'
        }, {
          lang: 'en',
          content: 'Love'
        }
      ]
    }, {
      value: 'like',
      matIcon: 'thumb_up_alt',
      // faIcon: 'fas fa-thumbs-up',
      title: [
        {
          lang: 'vi',
          content: 'Thích'
        }, {
          lang: 'en',
          content: 'Like'
        }
      ]
    }, {
      value: 'dislike',
      matIcon: 'thumb_down_alt',
      // faIcon: 'fas fa-thumbs-down',
      title: [
        {
          lang: 'vi',
          content: 'Không thích'
        }, {
          lang: 'en',
          content: 'Dislike'
        }
      ]
    }, {
      value: 'satisfied',
      matIcon: 'sentiment_very_satisfied',
      faIcon: 'fas fa-laugh-squint',
      title: [
        {
          lang: 'vi',
          content: 'Hài lòng'
        }, {
          lang: 'en',
          content: 'Satisfied'
        }
      ]
    }, {
      value: 'sad',
      matIcon: 'sentiment_dissatisfied',
      faIcon: 'fas fa-sad-tear',
      title: [
        {
          lang: 'vi',
          content: 'Buồn'
        }, {
          lang: 'en',
          content: 'Sad'
        }
      ]
    }, {
      value: 'angry',
      faIcon: 'fas fa-angry',
      title: [
        {
          lang: 'vi',
          content: 'Giận'
        }, {
          lang: 'en',
          content: 'Angry'
        }
      ]
    }
  ]

  isBrowser!: boolean;

  // $ npm run ng g c main/contents/_templates/comments/
  
  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private filesService: FilesService,
    private socketioService: SocketioService
  ) { }

  ngOnInit(): void {
    this.isBrowser = this.appService.isBrowser;
    this.userData = this.appService.userData;

    // console.log('-----this.pageData');
    // console.log(this.pageData);

    this.getLangData();

    const messages = {
      write: this.socketioService.messages.webComment.write + '_' + this.appService.domain,
      reply: this.socketioService.messages.webComment.reply + '_' + this.appService.domain
    }
    if (this.isBrowser) {
      this.socket = this.socketioService.on(messages.write).subscribe(content => {
        this.addComment(content.data);
      }, err => this.appService.logErr(err, 'Socket listien on: messages.write', 'CommentsComponent'));
    }
  }

  getLangData() {
    this.commonData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.dateFormat = this.commonData.dateFormat;
  }

  addComment($event: any) {
    if ($event) {
      this.renderComment($event);
      this.dataSource.unshift($event);
    }
  }

  addReply($event: any, comment: any) {
    console.log($event);
    console.log(comment);
    
  }

  renderComment(e: any) {
    const user = e.userData ? e.userData : {};
    e.name = user.nickname ? user.nickname : (user.fullname ? user.fullname : this.langContent.passersby) ;

    if (e.content) {
      const length = 150;
      if (e.content.length > length) {
        e.shortContent = e.content.substring(0, length) + '...';
        e.contentView = e.shortContent;
      } else {
        e.contentView = e.content;
      }
    }

    this.getFellings(e);
  }

  getFellings(e) {
    // fellingItem = {
    //   user: 'userAlias',
    //   status: 'fellingStatus'
    // }
    e.fellingsData = this.appService.isArray(e.fellingsData).data;
    const item = e.fellingsData.find((i: any) => i.user === this.userData.alias); //userData.alias = userData.userLevel + '_' + userData.username
    e.fellings = {
      status: item?.status,
    }
    let emoji = this.emojis.find((i: any) => i.value === e.fellings.status);
    if (!emoji) { emoji = this.emojis.find((i: any) => i.value === 'like') }
    e.fellings.faIcon = emoji?.faIcon;
    e.fellings.matIcon = emoji?.matIcon;
    e.fellings.title = this.languageService.getLangValue(emoji?.title, this.lang);
  }

  selectEmoji(item: any, cm: any) {
    cm.openEmojis = false;
    cm.fellings.status = item.value;
    cm.fellings.faIcon = item.faIcon;
    cm.fellings.matIcon = item.matIcon;
    cm.fellings.title = this.languageService.getLangValue(item.title, this.lang);

    const fellingItem = {
      user: this.userData.alias,
      status: cm.fellings.status
    }
    const index = cm.fellingsData.findIndex((i: any) => i.user === fellingItem.user);
    if (index === -1) {
      cm.fellingsData.push(fellingItem);
    } else {
      cm.fellingsData.splice(index, 1, fellingItem);
    }
  }

  expandContent(data: any,) {
    data.openContent = !data.openContent;
    data.contentView = data.openContent ? data.content : data.shortContent;
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
