import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentQuoteComponent } from './content-quote.component';

describe('ContentQuoteComponent', () => {
  let component: ContentQuoteComponent;
  let fixture: ComponentFixture<ContentQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
