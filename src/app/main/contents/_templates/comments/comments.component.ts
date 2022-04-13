import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
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

  subscription: Subscription;

  @Input() lang!: string;
  @Input() pageData: any;
  @Input() maxLength: number;

  socket: any;
  
  commonData: any = {};
  langsData: any = [
    {
      lang: 'vi',
      loginMess: 'ĐĂNG NHẬP để có thể thảo luận và hơn thế nữa!',
      noComment: 'Chưa có bình luận nào ở đây. Hãy là người đầu tiên để lại bình luận cho chúng tôi nào!',
      passersby: 'Khách vãng lai',
      writeComment: {
        label: 'Viết bình luận',
        placeholder: 'Viết bình luận của bạn...',
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
      hideAway: 'Ẩn bớt',
      comment: 'Bình luận',
      comments: 'Bình luận',
      feedback: 'Phản hồi',
      feedbacks: 'Phản hồi',
      profileLink: '/vi/ho-so/'
    },
    {
      lang: 'en',
      loginMess: 'LOG IN for discussion and more',
      noComment: 'There is not any comment here. Be the first to leave us a comment, plese!',
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
      hideAway: 'Hide away',
      comment: 'Comment',
      comments: 'Comments',
      feedback: 'Feedback',
      feedbacks: 'Feedbacks',
      profileLink: '/en/profile/'
    }
  ];
  langContent: any = {};
  dateFormat!: string;

  userData: any = {};

  DATA: any = [];
  dataSource: any = [];
  viewSource: any = [];
 
  start: number = 0;
  end: number = 0;

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

  messages = {
    write: '',
    reply: ''
  }

  devMod: boolean = true;
  viewData!: boolean;

  // $ npm run ng g c main/contents/_templates/comments/cm-item
  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private filesService: FilesService,
    private socketioService: SocketioService
  ) { 
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === socketioService.messages.user.login || message.text === socketioService.messages.user.logout) {
        this.userData = appService.getUserData();
      }
    });
  }

  ngOnInit(): void {
    this.isBrowser = this.appService.isBrowser;
    this.userData = this.appService.userData;

    if (this.devMod) {
      const hostname = this.appService.hostname;
      this.viewData = hostname === 'localhost';
    } else {
      this.viewData = true;
    }

    this.getLangData();

    if (!this.maxLength) { this.maxLength = 1 };
    if (this.appService.USERS) {
      this.getData();
    } else {
      this.getUsers();
    }

    this.messages.write = this.socketioService.messages.webComment.write + '_' + this.appService.domain + '_' + this.pageData.cat + '_' + this.pageData.id;
    this.messages.reply = this.socketioService.messages.webComment.reply + '_' + this.appService.domain + '_' + this.pageData.cat + '_' + this.pageData.id;

    if (this.isBrowser) {
      this.socket = this.socketioService.on(this.messages.write).subscribe(content => {
        const newComment = content.data;
        this.renderComment(newComment);
        this.dataSource.unshift(newComment);
        this.viewSource.unshift(newComment);
      }, err => this.appService.logErr(err, 'Socket listien on: messages.write', 'CommentsComponent'));

      this.socket = this.socketioService.on(this.messages.reply).subscribe(content => {
        this.updateReply(content.data);
      }, err => this.appService.logErr(err, 'Socket listien on: messages.reply', 'CommentsComponent'));
    }
  }

  getLangData() {
    this.commonData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
    this.dateFormat = this.commonData.dateFormat;
  }

  logErr(err: any, functionName: string) {
    this.appService.logErr(err, functionName, 'CommentsComponent');
  }

  getUsers() {
    const logErr = (err: any) => this.logErr(err, 'getUsers()');
    this.appService.getUsers().subscribe(res => {
      if (res.data) {
        res.data.forEach((e) => {
          this.appService.renderUser(e);
        });
        this.appService.USERS = res.data;
        this.getData();
      } else {
        logErr(res.err);
      }
    }, err => logErr(err));
  }

  getData() {
    const logErr = (err: any) => this.logErr(err, 'getData()');
    this.appService.getSqlData({
      table: this.appService.tables.webComments,
      where: 'WHERE postID = "' + this.pageData.id + '" AND postCat = "' + this.pageData.cat + '" AND enabled = 1',
      orderBy: 'ORDER BY id DESC'
    }).subscribe(res => {
      if (res.mess === 'ok') {
        this.DATA = res.data;
        this.renderData();
      } else {
        logErr(res.err);
      }
    }, err => logErr(err));
  }

  renderData() {
    const DATA = this.DATA.filter((item: any) => item.enabled);
    const dataSource: any = [];
    DATA.forEach((e: any) => {
      this.renderComment(e);
      if (!e.commentID) {
        const reps = DATA.filter((item: any) => item.commentID === e.id);
        e.reps = reps.filter((item: any) => !item.replyID);

        e.reps.forEach((rep: any) => {
          rep.reps = DATA.filter((item: any) => item.replyID === rep.id);
        });
        dataSource.push(e);
      }
    });
    this.dataSource = dataSource;
    // console.log(this.dataSource);
    this.exportData();
  }

  exportData() {
    this.start = this.viewSource.length;
    this.end = this.start + this.maxLength;

    const newData = this.dataSource.slice(this.start, this.end);
    this.viewSource = this.viewSource.concat(newData);
  }

  addComment($event: any) {
    let content = JSON.stringify({
      comment: $event.content,
      repFor: $event.repFor,
      tags: []
    });
    const logErr = (err: any) => this.logErr(err, 'addComment()');
    const dataPost = {
      table: this.appService.tables.webComments,
      fields: {
        postID: this.pageData.id,
        postCat: this.pageData.cat,
        content: content,
        user: JSON.stringify({
          username: this.userData.alias,
          userAgent: this.appService.userAgent
        })
      },
      options: {
        createdTime: true
      }
    }
    this.appService.addSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        const newComment = res.data;
        newComment.enabled = 1;
        this.DATA.unshift(newComment);

        this.renderComment(newComment);
        this.dataSource.unshift(newComment);
        this.viewSource.unshift(newComment);

        const dataEmit = {
          message: this.messages.write,
          emit: false,
          broadcast: true,
          content: {
            data: newComment
          }
        }
        this.socketioService.emit('client_emit', dataEmit);
      } else {
        logErr(res.err);
      }
    }, err => logErr(err));
  }

  reply(cm: any, rp: any, rpRep: any, cmIndex: number, repForUser: any, ) {
    cm.repFor = {
      name: repForUser ? repForUser.nickname ? repForUser.nickname : repForUser.fullname : '',
      username: repForUser.alias
    };
    
    cm.replyData = {};
    cm.replyData.commentID = cm.id;
    if (rp) {
      cm.replyData.replyID = rpRep ? rpRep.id : rp.id;
    }

    if (this.isBrowser) {
      const inputID = 'replyInput' + cmIndex;
      const input = document.getElementById(inputID) as HTMLElement;
      setTimeout(() => {
        input?.focus();
      }, 1);
    }
  }

  addReply($event: any, comment: any) {
    let content = JSON.stringify({
      comment: $event.content,
      repFor: comment.repFor,
      tags: []
    });

    const dataPost = {
      table: this.appService.tables.webComments,
      fields: {
        postID: this.pageData.id,
        postCat: this.pageData.cat,
        commentID: comment.id,
        replyID: comment.replyData?.replyID,
        content: content,
        user: JSON.stringify({
          username: this.userData.alias,
          userAgent: this.appService.userAgent
        })
      },
      options: {
        createdTime: true
      }
    }

    const logErr = (err: any) => this.logErr(err, 'addReply()');
    this.appService.addSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        const newReply = res.data;
        newReply.enabled = 1;
        this.updateReply(newReply)

        const dataEmit = {
          message: this.messages.reply,
          emit: false,
          broadcast: true,
          content: {
            data: newReply
          }
        }
        this.socketioService.emit('client_emit', dataEmit);
      } else {
        logErr(res.err);
      }
    }, err => logErr(err));

    setTimeout(() => {
      comment.repFor = null;
      comment.replyData = null;
    }, 1);
  }

  updateReply(newReply: any) {
    this.renderComment(newReply);

    const updateToSource = (dataSource: any) => {
      const comment = dataSource.find((item) => item.id === newReply.commentID);
      if (comment) {
        if (newReply.replyID) {
          const reply = comment.reps.find((item: any) => item.id === newReply.replyID);
          if (reply) {
            reply.reps.unshift(newReply);
            reply.showReplies = true;
          }
        } else {
          comment.reps.unshift(newReply);
          comment.showReplies = true;
        }
      }
    }

    // updateToSource(this.viewSource);
    updateToSource(this.dataSource);
  }

  renderComment(e: any) {
    e.user = this.appService.isObject(e.user).data;
    e.userData = this.appService.USERS.find((item: any) => item.alias === e.user.username);
    if (!e.userData) { e.userData = {} };
    const user = e.userData;
    e.name = user.nickname ? user.nickname : (user.fullname ? user.fullname : this.langContent.passersby) ;

    if (e.content) {
      //get user has been taged or reply ...
      
      const content = this.appService.isObject(e.content).data;
      e.repFor = content.repFor;
      e.tags = content.tags;
      
      e.comment = content.comment;
      const length = 150;
      if (e.comment.length > length) {
        e.shortContent = e.comment.substring(0, length) + '...';
        e.contentView = e.shortContent;
      } else {
        e.contentView = e.comment;
      }
    }

    e.reps = [];

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

  viewHiddenData(view: boolean) {
    if (view) {
      this.dataSource = this.DATA;
    } else {
      this.dataSource = this.DATA.filter((item: any) => item.enabled);
    }
  }

  login() {
    this.messageService.sendMessage(this.messageService.messages.openLogin, null);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }

}
