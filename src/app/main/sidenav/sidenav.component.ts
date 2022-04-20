import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() open: boolean;

  @Output() toggleSidenav = new EventEmitter();

  siteName!: string;
  menuData: any;

  isBrowser!: boolean;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    // this.siteName = this.appService.siteName;
    this.siteName = this.appService.domainData.domain;
    const menu = this.appService.domainData?.menu;
    if (menu) {
      const e = menu.find((item: any) => item.lang === this.appService.sitelang);
      const menuData = e.data;
      menuData.forEach((menu: any) => {
        if (!menu.icon) { menu.icon = '<i class="fas fa-folder"></i>' };

        if (menu.childs) {
          menu.childs.forEach((child: any) => {
            if (!child.icon) { child.icon = '<i class="fas fa-list-ul"></i>' };
          });
        }
      });
      this.menuData = menuData;
    }

    this.isBrowser = this.appService.isBrowser;
  }

}
