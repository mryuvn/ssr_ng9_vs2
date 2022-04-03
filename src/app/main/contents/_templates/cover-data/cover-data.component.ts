import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cover-data',
  templateUrl: './cover-data.component.html',
  styleUrls: ['./cover-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoverDataComponent implements OnInit {

  @Input() title!: string;
  @Input() caption!: string;
  @Input() data: any;
  @Input() coverConfig: any;
  @Input() isBrowser!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.setConfig();
  }

  setConfig() {
    if (this.coverConfig) {
      if (this.coverConfig.avatar) {
        const avatarConfig = this.coverConfig.avatar;
        if (avatarConfig.enable) {
          if (avatarConfig.width) {
            const picturesWidth = avatarConfig.width.value + avatarConfig.width.unit;
            this.coverConfig.picturesStyles = {
              width: picturesWidth
            }
            if (avatarConfig.margin) {
              const marginValue = avatarConfig.margin.value + avatarConfig.margin.unit;
              if (avatarConfig.position === 'left') {
                this.coverConfig.picturesStyles.paddingRight = marginValue;
              } else if (avatarConfig.position === 'right') {
                this.coverConfig.picturesStyles.paddingLeft = marginValue;
              } else if (avatarConfig.position === 'top') {
                this.coverConfig.picturesStyles.paddingBottom = marginValue;
              } else {
                this.coverConfig.picturesStyles.paddingTop = marginValue;
              }
            }
  
            this.coverConfig.dataStyles = {};
            if (avatarConfig.position === 'left' || avatarConfig.position === 'right') {
              this.coverConfig.dataStyles.width = (100 - avatarConfig.width.value) + avatarConfig.width.unit;
            }
          }
  
          if (avatarConfig.height) {
            avatarConfig.heightStyles = {
              paddingTop: avatarConfig.height.value + avatarConfig.height.unit
            }
            avatarConfig.marginTop = {
              marginTop: (-(100-avatarConfig.height.value)/2) + avatarConfig.height.unit
            }
          }
        }
      }
    }
  }

}
