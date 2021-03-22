import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {

  @Output() close = new EventEmitter();

  lang: string;
  
  themeSettings: any;
  open: string;

  colors: any = [
    {
      type: 'primary',
      data: {}
    },
    {
      type: 'accent',
      dat: {}
    },
    {
      type: 'warn',
      data: {}
    },
    {
      type: 'light',
      data: {}
    },
    {
      type: 'background',
      data: {}
    }
  ];

  data: any = {
    enabled: false,
    success: 'Updated theme settings!',
    fail: 'Something went wrong, please try againt later!'
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private messageService: MessageService,
    private snackbarService: SnackbarService,
    private socketioService: SocketioService
  ) { }

  ngOnInit(): void {
    this.themeSettings = this.appService.themeSettings;
    this.lang = this.route.snapshot.params.lang;

    this.getColors();

    setTimeout(() => {
      this.open = 'open';
    }, 1);
  }

  getColors() {
    this.colors.forEach(e => {
      if (e.type === 'primary') {
        e.data = this.themeSettings.primary;
      } else if (e.type === 'accent') {
        e.data = this.themeSettings.accent;
      } else if (e.type === 'warn') {
        e.data = this.themeSettings.warn;
      } else if (e.type === 'background') {
        e.data = this.themeSettings.background;
      } else {
        e.data = this.themeSettings.light;
      } 
    });
  }

  selectColor($event, item) {
    this.data.enabled = true;
    if ($event) {
      item.data = $event;
      if (item.type === 'primary') {
        this.themeSettings.primary = item.data;
      } else if (item.type === 'accent') {
        this.themeSettings.accent = item.data;
      } else if (item.type === 'warn') {
        this.themeSettings.warn = item.data;
      } else if (item.type === 'background') {
        this.themeSettings.background = item.data;
      } else {
        this.themeSettings.light = item.data;
      }
      this.messageService.sendMessage(this.messageService.messages.updateThemeSettings, {themeSettings: this.themeSettings});
    }
  }

  submit() {
    this.appService.settingTheme(this.themeSettings).subscribe(res => {
      if (res.mess === 'ok') {
        this.data.enabled = false;
        this.snackbarService.openSnackBar({ message: this.data.success, horizon: 'right' });
        const emitData = {
          message: this.messageService.messages.updateThemeSettings + '_' + this.appService.domain,
          emit: false,
          broadcast: true,
          content: {
            themeSettings: this.themeSettings
          }
        }
        this.socketioService.emit("client_emit", emitData);
        this.closeSetting();
      } else {
        this.snackbarService.openSnackBar({ message: this.data.fail, horizon: 'right' });
        console.log({ res: res, time: new Date() });
      }
    }, err => {
      this.snackbarService.openSnackBar({ message: this.data.fail, horizon: 'right' });
      console.log({ err: err, time: new Date() });
    });
  }

  closeSetting() {
    this.open = null;
    setTimeout(() => {
      this.close.emit('reloadData');
    }, 300);
  }

}
