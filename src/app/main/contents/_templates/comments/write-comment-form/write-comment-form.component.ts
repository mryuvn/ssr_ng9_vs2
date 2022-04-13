import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { AppService } from 'src/app/services/app.service';
import { LayoutService } from 'src/app/services/layout.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-write-comment-form',
  templateUrl: './write-comment-form.component.html',
  styleUrls: ['./write-comment-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WriteCommentFormComponent implements OnInit {

  @Input() inputID!: string;
  @Input() commonData: any;
  @Input() langContent: any;
  @Input() config: any;
  @Input() userData: any;
  @Input() avatarWidth: any;
  @Input() cmData: any;

  @Output() emitData = new EventEmitter();

  defaultConfig: any = {
    appearance: 'outline',
    floatLabel: 'auto',
    submit: {
      icon: '<i class="fas fa-paper-plane"></i>',
      iconOnly: false,
      background: { type: 'accent' },
      color: { type: 'white' },
      styles: {
        height: '40px'
      }
    }
  }

  formData: any = {};
  

  constructor(
    private appService: AppService,
    private layoutService: LayoutService
  ) { }

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig() {
    if (!this.config) { this.config = this.defaultConfig };
    if (!this.config.appearance) { this.config.appearance = this.defaultConfig.appearance };
    if (!this.config.floatLabel) { this.config.floatLabel = this.defaultConfig.floatLabel };
    if (!this.config.submit) { this.config.submit = this.defaultConfig.submit };
    this.layoutService.getElementStyles(this.config.submit);
  }

  submit() {
    if (this.cmData?.repFor) {
      this.formData.repFor = this.cmData?.repFor;
    }
    this.emitData.emit(this.formData);

    setTimeout(() => {
      this.formData = {};
    }, 1);
    
  }
}
