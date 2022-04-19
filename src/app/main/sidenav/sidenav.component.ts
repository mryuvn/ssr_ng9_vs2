import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() open: boolean;

  @Output() toggleSidenav = new EventEmitter();

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    // console.log(this.appService.domainData);
    
  }

}
