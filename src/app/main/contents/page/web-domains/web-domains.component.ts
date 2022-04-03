import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-web-domains',
  templateUrl: './web-domains.component.html',
  styleUrls: ['./web-domains.component.scss']
})
export class WebDomainsComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  open!: boolean;
  domainNotFound!: boolean;
  domain!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.domain = this.appService.domain;
  }

  filterOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getData() {
    this.open = true;
    this.domainNotFound = false;

    if (this.options.length === 0) {
      const data = {
        api_key: this.appService.api.password,
        table: 'web_domains',
        fields: 'id,domain,enabled'
      }
      const apiUrl = this.appService.api.base + this.appService.api.apiRoute + '/get-domains?data='+JSON.stringify(data);
      this.appService.getAnyApi(apiUrl).subscribe(res => {
        if (res.mess === 'ok') {
          const domains = [];
          res.data.forEach((e: any) => {
            domains.push(e.domain);
          });
          this.options = domains;
          this.filterOptions();
        } else {
          this.appService.logErr(res.err, 'getData()', 'WebDomainsComponent');
        }
      }, err => this.appService.logErr(err, 'getData()', 'WebDomainsComponent'));
    }
  }

  selectDomain() {
    const domain = this.myControl.value;
    if (domain) {
      const index = this.options.findIndex((item: any) => item === domain);
      if (index === -1) {
        this.domainNotFound = true;
      } else {
        this.domainNotFound = false;
  
        if (typeof (Storage) !== "undefined") {
          localStorage.setItem("domain", domain);
        }

        if (this.appService.isBrowser) {
          const params = this.route.snapshot.params;
          const home = '/' + params.lang;
          const route = this.router.url;
          if (route !== home) {
            this.router.navigate([home]);
          }

          setTimeout(() => {
            window.location.reload();
          }, 1);
        }
      }
    }
  }

}
