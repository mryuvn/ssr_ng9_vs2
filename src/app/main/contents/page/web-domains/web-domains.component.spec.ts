import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebDomainsComponent } from './web-domains.component';

describe('WebDomainsComponent', () => {
  let component: WebDomainsComponent;
  let fixture: ComponentFixture<WebDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebDomainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
