import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSubscribeFormComponent } from './news-subscribe-form.component';

describe('NewsSubscribeFormComponent', () => {
  let component: NewsSubscribeFormComponent;
  let fixture: ComponentFixture<NewsSubscribeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSubscribeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSubscribeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
