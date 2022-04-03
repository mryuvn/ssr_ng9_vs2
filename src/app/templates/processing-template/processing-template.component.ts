import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-processing-template',
  templateUrl: './processing-template.component.html',
  styleUrls: ['./processing-template.component.scss']
})
export class ProcessingTemplateComponent implements OnInit {

  @Input() lang: any;
  @Input() data: any;

  @Output() close = new EventEmitter();
  @Output() retry = new EventEmitter();

  commonData: any = {};

  constructor(
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.commonData = this.languageService.getLangData(this.lang);
  }

}
