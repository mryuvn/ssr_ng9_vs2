import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { AppService } from './app.service';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  public fileTypes = [
    {
      types: [],
      faIcon: 'fas fa-file',
      image: false
    },
    {
      types: ['folder'],
      faIcon: 'fas fa-folder-open',
      image: false
    },

    {
      types: ['jpg', 'jpeg', 'png', 'gif'],
      faIcon: 'fas fa-file-image',
      image: true
    },
    {
      types: ['psd', 'tif'],
      faIcon: 'fas fa-file-image',
      image: false
    },

    {
      types: ['pdf'],
      faIcon: 'fas fa-file-pdf',
      image: false
    },
    {
      types: ['doc', 'docx'],
      faIcon: 'fas fa-file-word',
      image: false
    },
    {
      types: ['xls', 'xlsx'],
      faIcon: 'fas fa-file-excel',
      image: false
    },
    {
      types: ['zip', 'rar'],
      faIcon: 'fas fa-file-archive',
      image: false
    },

    {
      types: ['txt'],
      faIcon: 'fas fa-file-alt',
      image: false
    },
    {
      types: ['html', 'xml', 'svg', 'js', 'ts', 'json', 'css', 'scss'],
      faIcon: 'fas fa-file-code',
      image: false
    },
    {
      types: ['php'],
      faIcon: 'fab fa-php',
      image: false
    }
  ]

  constructor(
    private http: HttpClient,
    private appService: AppService,
    private socketioService: SocketioService
  ) { }

  public getFileExt(filename: string) {
    if (filename) {
      return filename.split('.').pop();
    }
    return null;
  }
 
  public getFileSize(size: number) {
    if (size < 1024) {
      var data = {
        size: size,
        unit: 'Bytes'
      }
    } else {
      const KB = size / 1024;
      if (KB < 1024) {
        var data = {
          size: KB,
          unit: 'KB'
        }
      } else {
        const MB = KB / 1024;
        if (MB < 1024) {
          var data = {
            size: MB,
            unit: 'MB'
          }
        } else {
          const GB = MB / 1024;
          if (GB < 1024) {
            var data = {
              size: GB,
              unit: 'BG'
            }
          } else {
            const TB = GB / 1024;
            if (TB < 1024) {
              var data = {
                size: TB,
                unit: 'TB'
              }
            } else {
              const PB = TB / 1024;
              if (PB < 1024) {
                var data = {
                  size: PB,
                  unit: 'PB'
                }
              } else {
                const EB = PB / 1024;
                if (EB < 1024) {
                  var data = {
                    size: EB,
                    unit: 'EB'
                  }
                } else {
                  const ZB = EB / 1024;
                  var data = {
                    size: ZB,
                    unit: 'ZB'
                  }
                }
              }
            }
          }
        }
      }
    }
    return data;
  }

  public getFileType(filename) {
    if (filename) {
      const results = [];
  
      const fileExt = filename.split('.').pop();
      if (fileExt) {
        this.fileTypes.forEach(e => {
          const rs = e.types.find(item => item === fileExt.toLowerCase());
          if (rs) {
            results.push(e);
          }
        });
      }
  
      var fileType = results[0];
      if (!fileType) {
        fileType = this.fileTypes[0];
      }
  
      if (fileExt) {
        fileType.type = fileType.types.find(item => item === fileExt.toLowerCase());
      } else {
        fileType.type = null;
      }
  
      return {
        type: fileType.type,
        faIcon: fileType.faIcon,
        isImage: fileType.image
      };
    } else {
      return {
        type: null,
        faIcon: null,
        isImage: null
      }
    }
  }

  getImageBase64(file: File) {
    const imageToBase64 = (fileReader: FileReader, fileToRead: File): Observable<any> => {
      fileReader.readAsDataURL(fileToRead);
      return fromEvent(fileReader, 'load').pipe(pluck('currentTarget', 'result'));
    }
    const fileReader = new FileReader();
    return imageToBase64(fileReader, file);
  }

  public imageToDataUri(img, width, height) {
    var canvas = document.createElement('canvas'),
    ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    var image = new Image();
    image.src = img;
    ctx.drawImage(image, 0, 1, width, height);
    return canvas.toDataURL();
  }

  public getBase64FromUrl() {
    async (url) => {
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
  }

  public uploadFile(file: File, options: any) {
    var formData = new FormData();
    formData.append('file', file);

    const data = {
      api_key: this.appService.api.password,
      upload_path: options.uploadPath,
      filename: options.filename
    }
    const params = new HttpParams().set('data', JSON.stringify(data));
    const headers = new HttpHeaders({ 'Accept': 'application/json' });

    var url = this.appService.api.base + '/upload/single';
    return this.http.post<any>(url, formData, { headers: headers, params: params });
  }

}
