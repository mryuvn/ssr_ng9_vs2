import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ImageViewerComponent } from 'ng2-image-viewer';

@Component({
  selector: 'app-image-viewer-template',
  templateUrl: './image-viewer-template.component.html',
  styleUrls: ['./image-viewer-template.component.scss']
})
export class ImageViewerTemplateComponent implements OnInit {

  @Input() title: string;
  @Input() images: any[];
  @Input() showPDFOnlyOption: boolean;
  @Input() showOptions: boolean;
  @Input() download: boolean;
  @Input() enableTooltip: boolean;
  @Input() primaryColor: string;
  @Input() buttonsColor: string;
  @Input() buttonsHover: string;
  @Input() defaultDownloadName: string;
  @Input() indexImagemAtual: number;

  @Output() onNext = new EventEmitter();
  @Output() onPrevious = new EventEmitter();

  @ViewChild(ImageViewerComponent, {static: true}) imageViwer: ImageViewerComponent;

  constructor() { }

  ngOnInit() {
    if (this.showOptions === undefined) {
      this.showOptions = true;
    }
    if (this.download === undefined) {
      this.download = true;
    }
    if (this.enableTooltip === undefined) {
      this.enableTooltip = true;
    }

    if (this.indexImagemAtual) {
      setTimeout(() => {
        this.imageViwer.indexImagemAtual = this.indexImagemAtual;
        this.imageViwer.showImage();
      }, 1000);
    }
  }

}
