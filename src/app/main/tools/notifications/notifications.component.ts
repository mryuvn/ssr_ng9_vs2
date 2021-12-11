import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input() lang: string;
  
  @Output() openTool = new EventEmitter();
  @Output() closeTool = new EventEmitter();

  openMenu: boolean;

  langsData: any = [
    {
      lang: 'vi',
      noData: 'Không có thông báo nào!'
    },
    {
      lang: 'en',
      noData: 'There is no notification!'
    }
  ];
  langContent: any = {};

  dataSource: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    if (!this.lang) {
      this.lang = this.route.snapshot.params.lang;
    }
    this.getLangData();
  }

  getLangData() {
    this.langContent = this.languageService.getLangContent(this.langsData, this.lang);
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
    if (this.openMenu) {
      this.openTool.emit();
    }
  }

}
