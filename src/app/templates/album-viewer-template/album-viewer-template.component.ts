import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-album-viewer-template',
  templateUrl: './album-viewer-template.component.html',
  styleUrls: ['./album-viewer-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlbumViewerTemplateComponent implements OnInit, OnDestroy {

  @Input() lang: any;
  @Input() userData: any;
  @Input() viewDemo: boolean;

  subscription: Subscription;

  langData: any = {};
  langsData: any = [
    {
      lang: 'vi'
    },
    {
      lang: 'en'
    }
  ];
  langContent: any = {};

  data: any;

  open: String;
  title: String;
  dataSource: any;
  images: any;

  selectedID: number;
  indexImagemAtual: number;

  imagesDemo = [
    "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.0-9/161536269_3685270174911720_4173329350181972595_o.jpg?_nc_cat=102&ccb=1-3&_nc_sid=730e14&_nc_ohc=svLhIOaHQqwAX88Svm9&_nc_oc=AQmQMkqeeu09QNrjmx0-B_Ga2JgEd_BnSM5qYCnnGUovLRqlXjCruwRjJIauxRtMDjA&_nc_ht=scontent.fhan5-2.fna&oh=40944f7d56eb053484983b8479d2991b&oe=607BA1D3",
    "https://scontent.fhan5-2.fna.fbcdn.net/v/t1.0-9/162533087_3696767830428621_8051539770054049773_o.jpg?_nc_cat=1&ccb=1-3&_nc_sid=730e14&_nc_ohc=wAx8wC22IZcAX88yB2F&_nc_ht=scontent.fhan5-2.fna&oh=6546d55b93a2b70c330d242c9d7b99cc&oe=607AA7FE",
    "http://xxxgaixinh.sextgem.com/images/https-i-a4vn-com-2013-9-27-ngam-anh-nude-girl-han-quoc-nguc-khung-show-hang-nong-847fe5-jpg.jpg",
    "https://anhsexhd.pro/wp-content/uploads/2019/07/%E1%BA%A2nh-sex-g%C3%A1i-xinh-l%C3%A0m-t%C3%ACnh-%C4%91%E1%BA%B3ng-c%E1%BA%A5p-ko-che-8.jpg"
  ];

  constructor(
    private appService: AppService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private socketioService: SocketioService,
    private filesService: FilesService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.openImageViewer) {
        this.title = message.data.title;
        this.selectedID = message.data.selectedID;
        this.dataSource = message.data.images;
        this.indexImagemAtual = message.data.index;
        this.getLangData();

        this.openData();
      }
    })
  }

  ngOnInit() {
  }

  getLangData() {
    this.langData = this.languageService.getLangData(this.lang);
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  openData() {
    if (this.indexImagemAtual === undefined) {
      this.indexImagemAtual = 0;
    }
    if (this.viewDemo) {
      this.dataSource = this.imagesDemo;
    }
    setTimeout(() => {
      this.open = 'open';
      // this.getBase64(this.dataSource);
      this.images = this.dataSource;
    }, 10);
  }

  getBase64(dataSource) {
    // convert image link to Base64 here...
    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
          const base64data = reader.result;   
          resolve(base64data);
        }
      });
    }

    const results = [];
    const errors = [];
    const dataLength = dataSource.length;
    dataSource.forEach(url => {
      getBase64FromUrl(url).then(res => {
        results.push(res);
        if ((results.length + errors.length) === dataLength) {
          this.images = results;
          if (errors.length > 0) {
            console.log({errors: errors, time: new Date()});
          }
        }
      }).catch(err => {
        errors.push({ url: url, err: err });
        if ((results.length + errors.length) === dataLength) {
          this.images = results;
          console.log({errors: errors, time: new Date()});
        }
      });
    });
  }

  getIndexImagemAtual(images) {
    const rs = this.dataSource.find(item => item.id === this.selectedID);
    if (rs) {
      const index = images.findIndex(item => item === rs.base64);
      return index + 1;
    }
  }

  onNext($event) {
    this.getComments($event);
  }

  onPrevious($event) {
    this.getComments($event);
  }

  getComments(imageNumber) {
    const index = imageNumber - 1;
    const rs = this.images[index];
    // const image = this.dataSource.find(item => item.base64 === rs);
    // console.log(image);
    // this.selectedID = image.id;
  }

  close() {
    this.open = null;
    setTimeout(() => {
      this.images = null;
      this.data = null;
    }, 300);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
