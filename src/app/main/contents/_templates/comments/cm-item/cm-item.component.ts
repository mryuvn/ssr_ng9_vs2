import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-cm-item',
  templateUrl: './cm-item.component.html',
  styleUrls: ['./cm-item.component.scss']
})
export class CmItemComponent implements OnInit {

  @Input() class!: string;
  @Input() lang!: string;
  @Input() data: any;
  @Input() avatarWidth!: number;
  @Input() dateFormat!: string;
  @Input() langContent: any;
  @Input() userData: any;
  @Input() isBrowser!: boolean;

  @Output() reply = new EventEmitter();

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

  constructor(
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
  }

  expandContent(data: any) {
    data.openContent = !data.openContent;
    data.contentView = data.openContent ? data.comment : data.shortContent;
  }

  selectEmoji(item: any, data: any) {
    data.openEmojis = false;
    data.fellings.status = item.value;
    data.fellings.faIcon = item.faIcon;
    data.fellings.matIcon = item.matIcon;
    data.fellings.title = this.languageService.getLangValue(item.title, this.lang);

    const fellingItem = {
      user: this.userData.alias,
      status: data.fellings.status
    }
    const index = data.fellingsData.findIndex((i: any) => i.user === fellingItem.user);
    if (index === -1) {
      data.fellingsData.push(fellingItem);
    } else {
      data.fellingsData.splice(index, 1, fellingItem);
    }
  }

}
