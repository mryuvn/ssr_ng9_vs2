import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { FilesService } from './files.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  globalColors: any = [];
  FORMS: any;
  contactData: any;

  constructor(
    private appService: AppService,
    private filesService: FilesService
  ) { }

  findColor(color: any) {
    if (color) {
      const item = this.globalColors.find((i: any) => i.type === color.type);
      if (item) {
        color.hex = item.hex;
        color.rgba = item.rgba
      };
    }
  }

  getElementStyles(e: any) {
    e.styles = this.isObject(e.styles).data;
    if (e.color) {
      this.findColor(e.color);
      e.styles.color = e.color.rgba;
    }

    if (e.background) {
      this.findColor(e.background);
      e.styles.backgroundColor = e.background.rgba;
    }

    if (e.width) {
      e.styles.width = e.width.value + e.width.unit;
    }

    if (e.height) {
      e.styles.height = e.height.value + e.height.unit;
    }
  }

  setDataCols(cols: any) {
    if (!cols) { cols = {} };
    let xl = 'col-xl-' + (cols.xl ? 12/cols.xl : '12');
    let lg = 'col-lg-' + (cols.lg ? 12/cols.lg : '12');
    let md = 'col-md-' + (cols.md ? 12/cols.md : '12');
    let sm = 'col-sm-' + (cols.sm ? 12/cols.sm : '12');
    let xs = 'col-' + (cols.xs ? 12/cols.xs : '12');
    const dataCols = xl + ' ' + lg + ' ' + md + ' ' + sm + ' ' + xs;
    return dataCols;
  }

  getColsClass(cols) {
    if (!cols) { cols = {} };
    const xl = cols.xl ? cols.xl : '12';
    const lg = cols.lg ? cols.lg : '12';
    const md = cols.md ? cols.md : '12';
    const sm = cols.sm ? cols.sm : '12';
    const xs = cols.xs ? cols.xs : '12';
    return 'col-xl-'+xl + ' col-lg-'+lg + ' col-md-'+md + ' col-sm-'+sm + ' col-'+xs;
  }

  renderDataImages(data: any) {
    const coverImages: any = [];
    if (data.cover.images) {
      data.cover.images.forEach((image: any) => {
        if (image.enable) {
          coverImages.push({
            type: image.type,
            src: this.appService.getFileSrc(image)
          });
        }
      });
    }
    data.coverImages = coverImages;
    if (data.coverImages.length > 0) { data.mainCover = data.coverImages[0].src };

    if (data.avatar.images) {
      const avatarImages: any = [];
      data.avatar.images.forEach((image: any) => {
        image.src = this.appService.getFileSrc(image);
        if (image.type === 'file' || image.type === 'href') {
          const fileType = this.filesService.getFileType(image.value);
          image.isImage = fileType.isImage;
        }
        if (image.enable) {
          avatarImages.push({
            type: image.type,
            src: this.appService.getFileSrc(image),
            isImage: image.isImage
          });
        }
      });

      data.avatarImages = avatarImages;
      if (avatarImages.length>0) {
        data.avatarImages.forEach((image: any) => {
          if (image.type === 'iframe') {
            image.viewImage = true;
          } else {
            if (this.appService.isBrowser) {
              this.filesService.checkImage(image);
            }
          }
        });
        // data.mainAvatar = data.avatarImages[0]
      }
    }
  }

  getCoverConfig(data: any, cover: any) {
    if (cover) {
      if (data.cover.animation && data.cover.animation !== 'none') {
        cover.animation = data.cover.animation;
      }
  
      cover.contentStyles = this.appService.isObject(cover.contentStyles).data;

      if (cover.bgColor) { this.findColor(cover.bgColor) };
      if (cover.color) { this.findColor(cover.color) };
  
      if (!cover.title) { cover.title = {} };
      this.getElementStyles(cover.title);
  
      if (!cover.caption) { cover.caption = {} };
      this.getElementStyles(cover.caption);
  
      if (!cover.button) { cover.button = {} };
      this.getElementStyles(cover.button);
  
      if (!cover.avatar) { cover.avatar = {} };
      if (cover.avatar.enable && data.avatar.images) {
        if (data.avatar.images.length > 0) {
          if (!cover.avatar.position) { cover.avatar.position = 'left' };
          cover.avatarPosition = 'avatar-' + cover.avatar.position;
        } else {
          cover.avatarPosition = 'no-avatar';
        }
        cover.avatar.styles = this.appService.isObject(cover.avatar.styles).data;
      } else {
        cover.avatarPosition = 'no-avatar';
      }
    }
  }

  getDefaultLogo(domainData: any, logoData: any) {
    const logos = domainData?.layoutSettings?.logos;
    if (logos) {
      const logo = logos[0];
      if (logoData.enable === undefined) { logoData.enable = logo?.enable };
      if (!logoData.type) { logoData.type = logo?.type };
      if (!logoData.value) { logoData.value = logo?.value };
    }
  }

  isJSON(value: any) {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
      } catch (error) {
        return null;
      }
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  isArray(value: any) {
    const JSON = this.isJSON(value);
    if (Array.isArray(JSON)) {
      return {
        data: JSON
      }
    } 
    return {
      data: [],
      err: 'Value is not an Array',
      value: value
    };
  }

  isObject(value: any) {
    const JSON = this.isJSON(value);
    if (JSON) {
      if (Array.isArray(JSON)) {
        return {
          err: 'Value is not an Object, it is a Array',
          value: JSON,
          data: {}
        }
      }
      return {
        data: JSON
      };
    } 
    return {
      err: 'Value is not a JSON',
      value: value,
      data: {}
    }
  }

}
