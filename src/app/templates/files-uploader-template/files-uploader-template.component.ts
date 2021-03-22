import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { FilesService } from 'src/app/services/files.service';
import { LanguageService } from 'src/app/services/language.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-files-uploader-template',
  templateUrl: './files-uploader-template.component.html',
  styleUrls: ['./files-uploader-template.component.scss']
})
export class FilesUploaderTemplateComponent implements OnInit {

  @Input() lang: any;
  @Input() maxFileSize: number;
  @Input() maxTotalSize: number;
  @Input() maxUploads: number;
  @Input() hiddenFileInput: boolean;

  @Output() emitFiles = new EventEmitter();
  @Output() emitUploadFiles = new EventEmitter();
  @Output() disableUploadBtn = new EventEmitter();

  subscription : Subscription;

  langsData: any = [
    {
      lang: 'vi',
      title: 'Nhấp để chọn hoặc kéo và thả các tệp tin vào đây!',
      accepted: 'Chấp nhận',
      fileTypes: 'Bất kỳ định dạng tệp tin nào',
      maxFileSize: 'Kích thước tối đa mỗi tệp tin',
      maxTotalSize: 'Dung lượng tối đa',
      maxUploads: 'Số lượng tệp tin tối đa',
      fileSize: 'Kích thước',
      removeSelected: 'Xóa các tệp đã chọn',
      removeAll: 'Xóa tất cả',
      outOfFileSize: 'Không đủ dung lượng cho phép!',
      totalSize: 'Đã tải lên'
    },
    {
      lang: 'en',
      title: 'Click to Select or Drag and Drop files here!',
      accepted: 'Accepted',
      fileTypes: 'Any file types',
      maxFileSize: 'Max size of each file',
      maxTotalSize: 'Max of files size',
      maxUploads: 'Max number of files',
      fileSize: 'File size',
      removeSelected: 'Remove selected files',
      removeAll: 'Remove all',
      outOfFileSize: 'Not enough space allowed!',
      totalSize: 'Uploaded'
    }
  ];
  data: any = {};

  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  totalSize: any;
  filesLimited: String;

  checked: Boolean = false;
  indeterminate: Boolean = false;
  checkedFiles: any = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private filesService: FilesService,
    private languageService: LanguageService,
    private messageService: MessageService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.getLangData();
      }
    });
  }

  ngOnInit() {
    this.getLangData();
    if (!this.maxFileSize) {
      this.maxFileSize = 1024 * 1024 * 5;
    }

    if (!this.maxUploads) {
      this.maxUploads = 10;
    }

    this.options = { concurrency: 1, maxUploads: this.maxUploads, maxFileSize: this.maxTotalSize };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  getLangData() {
    this.data = this.languageService.getLangContent(this.langsData, this.lang);
  }

  //Files Uploader
  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        // const event: UploadInput = {
        //   type: 'uploadAll',
        //   url: '/upload',
        //   method: 'POST',
        //   data: { foo: 'bar' }
        // };
        // this.uploadInput.emit(event);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded
        break;
    }
    if (this.hiddenFileInput) {
      this.emitFiles.emit(this.files);
    } else {
      this.getSelectedFiles(this.files);
    }
  }

  getSelectedFiles(files) {
    const selectedFiles = [];
    const uploadFiles = [];
    const fileSizes = [];
    files.forEach(e => {
      selectedFiles.push(e);
      const file = e.nativeFile;
      e.fileSize = this.filesService.getFileSize(e.size);
      const fileType = this.filesService.getFileType(e.name);
      e.fileIcon = fileType.faIcon;
      if (fileType.image) {
        this.filesService.getImageBase64(file).subscribe(base64image => {
          e.base64image = base64image;
          const img = new Image();
          img.src = e.base64image;
          img.onload = () => {
            if (img.naturalWidth > img.naturalHeight) {
              e.imgLandscape = true;
            }
          }
          e.croppedImage = this.filesService.imageToDataUri(base64image, 50, 50);
        });
      }

      fileSizes.push(e.size);
      const totalSize = fileSizes.reduce((a, b) => a + b, 0);
      if (totalSize <= this.maxFileSize) {
        this.filesLimited = null;
        uploadFiles.push(file);
        this.emitUploadFiles.emit(uploadFiles);
      } else {
        this.filesLimited = this.data.outOfFileSize;
      }
    });

    const totalUploads = fileSizes.reduce((a, b) => a + b, 0);
    this.totalSize = this.filesService.getFileSize(totalUploads);

    if (selectedFiles.length === 0 || totalUploads > this.maxFileSize) {
      this.disableUploadBtn.emit(true);
    } else {
      this.disableUploadBtn.emit(false);
    }
  }

  startUpload(): void {
    console.log(this.files);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });

    const index = this.checkedFiles.findIndex(file => file.id === id);
    if (index !== -1) {
      this.checkedFiles.splice(index, 1);
    }
  }

  removeAllFiles(): void {
    // this.uploadInput.emit({ type: 'removeAll' });
    this.files = [];
    this.emitUploadFiles.emit([]);
    this.disableUploadBtn.emit(true);
  }

  triggerUploadButton() {
    const uploadButton = document.getElementById("uploadButton") as HTMLElement;
    setTimeout(() => {
      uploadButton.click();
    }, 10);
  }

  checkAll(checked, files) {
    const checkedFiles = [];
    files.forEach(e => {
      if (checked) {
        e.checked = true;
        checkedFiles.push(e);
      } else {
        e.checked = false;
      }
    });
    this.checkedFiles = checkedFiles;
  }

  checkFile(file, files) {
    if (file.checked) {
      this.checkedFiles.push(file);
    } else {
      const index = this.checkedFiles.findIndex(item => item.id === file.id);
      if (index !== -1) {
        this.checkedFiles.splice(index, 1);
      }
    }

    if (this.checkedFiles.length === 0) {
      this.checked = false;
      this.indeterminate = false;
    } else {
      if (this.checkedFiles.length === files.length) {
        this.checked = true;
        this.indeterminate = false;
      } else {
        this.checked = false;
        this.indeterminate = true;
      }
    }
  }

  removeSelected() {
    this.checkedFiles.forEach(file => {
      console.log(file.id);
      this.removeFile(file.id);
    });
  }

}
