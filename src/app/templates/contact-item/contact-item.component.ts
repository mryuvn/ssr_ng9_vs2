import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss']
})
export class ContactItemComponent implements OnInit {

  @Input() item: any;
  @Input() color: string;
  @Input() iconOnly: boolean;
  @Input() noIcon: boolean;

  items: any = [
    {
      type: 'tel',
      name: 'Tel',
      href: 'tel:',
      faIcon: 'fas fa-phone-alt',
      imgIcon: 'assets/imgs/icons/call.png',
      color: null
    }, {
      type: 'zalo',
      name: 'Zalo',
      href: '//zalo.me/',
      faIcon: null,
      imgIcon: 'assets/imgs/icons/zalo.png',
      color: '#0180c7'
    }, {
      type: 'viber',
      name: 'Viber',
      href: 'viber://chat/?viberNumber=',
      faIcon: 'fab fa-viber',
      imgIcon: 'assets/imgs/icons/viber.png',
      color: '#9069ae'
    }, {
      type: 'whatsapp',
      name: 'Whatsapp',
      href: 'https://api.whatsapp.com/send?phone=',
      faIcon: 'fab fa-whatsapp',
      imgIcon: 'assets/imgs/icons/whatsapp.png',
      color: '#54cc61'
    }, {
      type: 'skype',
      name: 'Skype',
      href: 'skype:',
      faIcon: 'fab fa-skype',
      imgIcon: 'assets/imgs/icons/skype.png',
      color: '#01aef3'
    }, {
      type: 'facebook',
      name: 'Facebook',
      href: 'https://facebook.com/',
      faIcon: 'fab fa-facebook-messenger',
      imgIcon: 'assets/imgs/icons/facebook-messenger.png',
      color: '#01aef3'
    }, {
      type: 'email',
      name: 'Email',
      href: 'mailto:',
      faIcon: 'fas fa-envelope',
      imgIcon: 'assets/imgs/icons/email.png',
      color: null
    }
  ];

  constructor() { }

  ngOnInit(): void {
    if (this.item) {
      const rs = this.items.find(e => e.type === this.item.type);
      if (rs) {
        this.item.name = rs.name;
        this.item.href = rs.href;
        this.item.faIcon = rs.faIcon;
        this.item.imgIcon = rs.imgIcon;
        this.item.color = rs.color;
      }
    }
  }

}
