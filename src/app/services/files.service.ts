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

  /**
  * uploadFiles
  */
  public uploadFiles(selectedFile, options) {
    var formData = new FormData();
    formData.append('file', selectedFile);

    const data = {
      domain: this.appService.domain,
      upload_path: options.uploadPath,
      filename: options.fileName
    }
    const params = new HttpParams().set('data', JSON.stringify(data));
    const headers = new HttpHeaders({ 'Accept': 'application/json' });

    var url = this.appService.baseUrl + 'upload/single';
    return this.http.post<any>(url, formData, { headers: headers, params: params });
  }

  /**
   * updateGallery
   */
  public updateGallery(file_name, db_table, uploadPath, album, postID, user) {
    const dataPost = {
      table: this.appService.tables.gallery,
      fields: {
        file_name: file_name,
        db_table: db_table,
        uploadPath: uploadPath,
        album: album,
        postID: postID,
        createdTime: new Date(),
        user: user
      }
    }
    this.appService.addSqlData(dataPost).subscribe(res => {
      if (res.mess === 'ok') {
        const dataEmit = {
          message: this.socketioService.messages.gallery.new,
          emit: true,
          broadcast: true,
          content: {
            id: res.newId,
            file_name: file_name,
            database: this.appService.databaseName,
            db_table: db_table,
            uploadPath: uploadPath,
            album: album,
            postID: postID,
            domain: this.appService.domain
          }
        }
        this.socketioService.emit('client_emit', dataEmit);
      } else {
        console.log({ res: res, time: new Date() });
      }
    }, err => console.log({ err: err, time: new Date() }));
  }

  /**
   * getFileSize
   */
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

  /**
   * getFileType
   */
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
        image: fileType.image
      };
    } else {
      return {
        type: null,
        faIcon: null,
        image: null
      }
    }
  }

  /**
   * getImageBase64
   */
  public getImageBase64(file) {
    const fileReader = new FileReader();
    return this.imageToBase64(fileReader, file);
  }

  /**
   * imageToBase64
   */
  public imageToBase64(fileReader: FileReader, fileToRead: File): Observable<string> {
    fileReader.readAsDataURL(fileToRead);
    return fromEvent(fileReader, 'load').pipe(pluck('currentTarget', 'result'));
  }

  /**
   * imageToDataUri
   */

  public imageToDataUri(img, width, height) {
    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
      // ctx = canvas.getContext('2d');
      ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    var image = new Image();
    image.src = img;
    ctx.drawImage(image, 0, 1, width, height);
    // ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
  }
  
  /**
   * getBase64FromUrl
   */
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

}
