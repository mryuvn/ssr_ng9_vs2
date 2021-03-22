import { Component, Inject, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DOCUMENT } from '@angular/common'; 

@Component({
  selector: 'app-image-cropper-template',
  templateUrl: './image-cropper-template.component.html',
  styleUrls: ['./image-cropper-template.component.scss']
})
export class ImageCropperTemplateComponent implements OnInit {

  @Input() lang: String;
  @Input() title: String;
  @Input() currentImage: string;
  @Input() aspectRatio: number;
  @Input() aspectRatioValue: number;
  @Input() customAspectRatio: any;
  @Input() resizeToWidth: number;
  @Input() cropperMinWidth: number;
  @Input() hiddenFileInput: boolean;
  @Input() multiple: Boolean;
  @Input() currentPictures: any;

  @Output() emitCropedImage = new EventEmitter();
  @Output() emitData = new EventEmitter();
  @Output() emitRemovePicture = new EventEmitter();
  @Output() disableUploadBtn = new EventEmitter();

  @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;

  currentImageLandscape: Boolean;

  aspectRatioQuotient: number;

  imageOption: String = 'select-image';
  fileInput: String = null;
  imageType: String = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedFile: File = null;
  selectedImage: File = null;
  showCropper = false;
  containWithinAspectRatio = false;

  selectedFileMessErr: Boolean;
  selectedFileMess: String;
  showCurrentImage: Boolean = true;

  selectedImagesList: any = [];
  selectedImagesArr: any = [];

  removeImageBtn: Boolean;
  removeBtn: String;

  langsData: any = [
    {
      lang: 'vi',
      clickOrDrag: 'Nhấp để chọn hoặc kéo và thả ảnh vào đây!',
      fileFormatNotMatch: 'Định dạng file không đúng!',
      fileAccepted: 'Định dạng được chấp nhận',
      croppingRatio: 'Tỷ lệ cắt hình'
    },
    {
      lang: 'en',
      clickOrDrag: 'Click to select or drag and drop photo here!',
      fileFormatNotMatch: 'Incorrect file format!',
      fileAccepted: 'Formats accepted',
      croppingRatio: 'Cropping ratio'
    }
  ];
  data: any = {};

  selectFilePaddingTop: string;
  selectFileWidth: string;

  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {
    // if (this.currentImage) {
    //   const img = new Image();
    //   img.src = this.currentImage;
    //   img.onload = () => {
    //     if (img.naturalWidth > img.naturalHeight) {
    //       this.currentImageLandscape = true;
    //     }
    //   }
    // }

    if (this.aspectRatio) {
      this.aspectRatioValue = 100 * this.aspectRatio / (this.aspectRatio + 1);
      this.aspectRatioQuotient = 100 - this.aspectRatioValue;
    } else {
      if (!this.aspectRatioValue) {
        this.aspectRatioValue = 58;
      }
      this.aspectRatioQuotient = 100 - this.aspectRatioValue;
      this.aspectRatio = this.aspectRatioValue / this.aspectRatioQuotient;
    }

    if (!this.resizeToWidth) {
      this.resizeToWidth = 450;
    }

    this.setSelectFileContainer();

    const rs = this.langsData.find(e => e.lang === this.lang);
    if (rs) {
      this.data = rs;
    } else {
      this.data = this.langsData[0];
    }
    this.selectedFileMess = this.data.clickOrDrag;
  }

  setAspectRatio(value) {
    this.aspectRatioQuotient = 100 - value;
    this.aspectRatio = this.aspectRatioValue / this.aspectRatioQuotient;
    this.setSelectFileContainer();
  }

  setSelectFileContainer() {
    const selectFilePaddingTop = this.aspectRatioQuotient / this.aspectRatioValue * 100;
    var selectFileWidth = 500;
    if (selectFilePaddingTop <= 80) {
      selectFileWidth = selectFileWidth + (selectFileWidth - selectFilePaddingTop * 10);
    } else {
      selectFileWidth = (selectFileWidth / selectFilePaddingTop * 10) * 10;
    }
    this.selectFilePaddingTop = selectFilePaddingTop + '%';
    this.selectFileWidth = selectFileWidth + 'px';
  }

  hoverSelectFile() {
    this.showCurrentImage = false;
  }

  leaveSelectFile() {
    this.showCurrentImage = true;
    this.selectedFileMessErr = false;
    this.selectedFileMess = this.data.clickOrDrag;
  }

  openSelectFile() {
    const inputFile = document.getElementById('fileInput');
    if (inputFile) {
      inputFile.click();
    }
  }

  fileChangeEvent(event: any): void {
    if (event) {
      const selectedFile = <File>event.target.files[0];
      if (selectedFile) {
        this.selectedFile = <File>event.target.files[0];
        if (this.selectedFile.type === 'image/png' || this.selectedFile.type === 'image/jpeg' || this.selectedFile.type === 'image/gif') {
          this.imageChangedEvent = event;
          this.imageOption = 'image-cropper';
          this.selectedFileMessErr = false;
          this.selectedFileMess = this.data.clickOrDrag;
        } else {
          this.selectedFileMessErr = true;
          this.selectedFileMess = this.data.fileFormatNotMatch;
          this.imageOption = 'select-image';
          this.showCurrentImage = false;
          this.emitData.emit(null);
          this.fileInput = null;
        }
      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    if (this.selectedFile) {
      this.selectedImage = new File([event.file], this.selectedFile.name, { type: this.selectedFile.type, lastModified: Date.now() });
      if (!this.multiple) {
        this.emitData.emit(this.selectedImage);
        if (!this.hiddenFileInput) {
          this.emitCropedImage.emit(this.croppedImage);
        }
      } else {
        this.disableUploadBtn.emit(true);
      }
    }
  }

  imageLoaded() {
    this.showCropper = true;
    // console.log('Image loaded');
  }

  cropperReady() {
    // console.log('Cropper ready');
  }

  loadImageFailed() {
    // console.log('Load failed');
  }

  rotateLeft() {
    this.imageCropper.rotateLeft();
  }

  rotateRight() {
    this.imageCropper.rotateRight();
  }

  flipHorizontal() {
    this.imageCropper.flipHorizontal();
  }

  flipVertical() {
    this.imageCropper.flipVertical();
  }

  resetImage() {
    this.imageCropper.resetImage();
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  removeSelectedImage() {
    this.imageOption = 'select-image';
    this.selectedFileMessErr = false;
    this.selectedFileMess = this.data.clickOrDrag;
    this.fileInput = null;
    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.selectedFile = null;
    this.selectedImage = null;
    if (!this.multiple) {
      this.emitData.emit(this.selectedImage);
      this.emitCropedImage.emit(this.croppedImage);
    }
  }

  selectImage() {
    this.selectedImagesList.push(this.croppedImage);
    this.selectedImagesArr.push(this.selectedImage);
    this.emitData.emit(this.selectedImagesArr);
    this.emitCropedImage.emit(this.selectedImagesList);
    this.removeSelectedImage();
    this.disableUploadBtn.emit(false);
  }

  removeImage(image) {
    const index = this.selectedImagesList.indexOf(image);
    this.selectedImagesList.splice(index, 1);
    this.selectedImagesArr.splice(index, 1);
    this.emitData.emit(this.selectedImagesArr);
    this.emitCropedImage.emit(this.selectedImagesList);
    if (this.selectedImagesArr.length === 0) {
      this.disableUploadBtn.emit(true);
    }
  }

  removePicture(picture) {
    const index = this.currentPictures.indexOf(picture);
    this.currentPictures.splice(index, 1);
    const picturesArr = [];
    this.currentPictures.forEach(e => {
      picturesArr.push(e.name);
    });
    const pictures = picturesArr.join(', ');
    this.emitRemovePicture.emit(pictures);
  }

  cropImage() {
    if (this.multiple) {
      this.selectImage();
    } else {
      this.imageOption = 'selected-image';
      this.emitCropedImage.emit(this.croppedImage);
    }
  }

}