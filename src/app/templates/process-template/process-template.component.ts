import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-process-template',
  templateUrl: './process-template.component.html',
  styleUrls: ['./process-template.component.scss']
})
export class ProcessTemplateComponent implements OnInit {
  @Input() data: any;

  @Output() retry = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
