import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsBannersComponent } from './ads-banners.component';

describe('AdsBannersComponent', () => {
  let component: AdsBannersComponent;
  let fixture: ComponentFixture<AdsBannersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsBannersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
