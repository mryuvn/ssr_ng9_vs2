import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() isBrowser: boolean;
  @Input() open: boolean;

  @Output() toggleSidenav = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
