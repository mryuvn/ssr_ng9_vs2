import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyForexComponent } from './why-forex.component';

describe('WhyForexComponent', () => {
  let component: WhyForexComponent;
  let fixture: ComponentFixture<WhyForexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyForexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyForexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
