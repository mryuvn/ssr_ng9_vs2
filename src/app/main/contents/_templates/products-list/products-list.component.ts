import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FilesService } from 'src/app/services/files.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  @Input() dataSource: any;
  @Input() config: any;
  @Input() postID!: number;
  @Input() activeID!: number;

  defaultConfig: any = {
    viewMod: 'default',
    coverLink: 'cover',
    cols: {
      xl: 3,
      lg: 3,
      md: 2,
      sm: 2,
      xs: 1
    },
    colMargin: {
      horizontal: {
        value: null,
        unit: 'px'
      },
      bottom: {
        value: 2,
        unit: 'rem'
      }
    },
    styles: {
      paddingBottom: '2rem'
    },
    itemStyles: {
      background: { type: 'white' },
      color: { type: 'primary' },
      styles: {
        padding: '10px',
        boxShadow: '0 3px 15px -7px rgba(0,0,0,0.5)'
      }
    },
    itemStylesOnHover: {
      zoomImage: 50,
      background: { type: 'background' },
      color: { type: 'warn' },
      boxShadow: '0 3px 30px -7px rgba(0,0,0,0.5)'
    },
    avatar: {
      enable: true,
      position: '',
      circle: false,
      width: {
        value: 100,
        unit: '%'
      },
      height: {
        value: 70,
        unit: '%'
      },
      styles: null
    },
    dataStyles: {},
    title: {
      enable: true,
      styles: {
        textTransform: 'uppercase',
        fontWeight: '300',
        marginTop: '.5rem'
      }
    },
    caption: {
      enable: true,
      maxLength: 50,
      styles: {
        opacity: 0.7,
        marginTop: '.5rem'
      }
    },
    button: {
      enable: false
    },
    price: {
      enable: false
    }
  }

  DATA: any = [];

  isBrowser!: boolean;

  constructor(
    private appService: AppService,
    private filesService: FilesService,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
    this.isBrowser = this.appService.isBrowser;
    // console.log(this.dataSource);
    // console.log(this.config);
    this.setStyles();
    this.renderData();
  }

  setStyles() {
    if (!this.config) { this.config = this.defaultConfig };
    if (this.config.styles) { this.config.mainStyles = this.appService.isObject(this.config.styles).data };

    if (!this.config.cols) { this.config.cols = this.defaultConfig.cols };
    this.config.dataCols = this.layoutService.setDataCols(this.config.cols);

    if (this.config.colMargin) {
      this.config.colStyles = {};
      const horizontal = this.config.colMargin.horizontal;
      if (horizontal) {
        if (horizontal.value >= 0) {
          const horizontalValue = horizontal.value + horizontal.unit;
          this.config.rowStyles = {
            marginLeft: '-' + horizontalValue,
            marginRight: '-' + horizontalValue
          }
    
          this.config.colStyles.paddingLeft = horizontalValue;
          this.config.colStyles.paddingRight = horizontalValue;
        }
      }

      let bottom = this.config.colMargin.bottom;
      if (!bottom) { bottom = this.defaultConfig.colMargin.bottom };
      if (bottom.value) {
        const bottomValue = bottom.value + bottom.unit;
        this.config.colStyles.marginBottom = bottomValue;
      }
    }

    if (!this.config.itemStyles) { this.config.itemStyles = this.defaultConfig.itemStyles };
    this.layoutService.getElementStyles(this.config.itemStyles);

    if (!this.config.avatar) { this.config.avatar = this.defaultConfig.avatar };
    const avatarConfig = this.config.avatar;
    if (avatarConfig.enable) {
      this.config.pictureStyles = {};
      if (avatarConfig.width) {
        const picturesWidth = avatarConfig.width.value + avatarConfig.width.unit;
        this.config.pictureStyles.width = picturesWidth;
      }
      if (avatarConfig.margin) {
        if (avatarConfig.margin.value) {
          const marginValue = avatarConfig.margin.value + avatarConfig.margin.unit;
          if (avatarConfig.position === 'left') {
            this.config.pictureStyles.marginRight = marginValue;
          } else {
            this.config.pictureStyles.marginBottom = marginValue;
          }
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

    if (!this.config.title) { this.config.title = this.defaultConfig.title };
    this.layoutService.getElementStyles(this.config.title);

    if (!this.config.caption) { this.config.caption = this.defaultConfig.caption };
    this.layoutService.getElementStyles(this.config.caption);

    if (!this.config.itemStylesOnHover) { this.config.itemStylesOnHover = this.defaultConfig.itemStylesOnHover };
    if (!this.config.itemStylesOnHover.background) { this.config.itemStylesOnHover.background = this.config.itemStyles.background };
    if (!this.config.itemStylesOnHover.color) { this.config.itemStylesOnHover.color = this.config.itemStyles.color };
    if (!this.config.itemStylesOnHover.boxShadow) { this.config.itemStylesOnHover.boxShadow = this.config.itemStyles.styles.boxShadow };
    this.layoutService.findColor(this.config.itemStylesOnHover.background);
    this.layoutService.findColor(this.config.itemStylesOnHover.color);
  }

  renderData() {
    if (this.config.viewMod === 'carousel') {
      
    } else if (this.config.viewMod === 'pagination') {
      
    } else {
      this.DATA = this.dataSource;
    }

    this.DATA.forEach((e: any) => {
      this.renderPost(e);
    });
    
    // console.log(this.DATA);
    
  }

  renderPost(data: any) { //not used
    const avatar = this.appService.isObject(data.avatar).data;
    if (avatar.images) {
      const image = avatar.images[0];
      if (image) {
        image.src = this.appService.getFileSrc(image);
        if (image.type === 'iframe') {
          image.viewImage = true;
        } else {
          if (this.appService.isBrowser) {
            this.filesService.checkImage(image);
          }
        }
        data.image = image;
      }
    }

    if (!data.name) { data.name = data.title };
    
    data.summary = '';
    if (data.caption) {
      const maxLength = this.config.caption.maxLength;
      if (maxLength) {
        let summary = data.caption.substring(0, (maxLength - 1));
        if (summary.length < data.caption.length) { summary = summary + '...' };
        data.summary = summary;
      } else {
        data.summary = data.caption;
      }
    }
  }

}
