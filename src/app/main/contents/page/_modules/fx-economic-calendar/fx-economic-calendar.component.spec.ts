import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FxEconomicCalendarComponent } from './fx-economic-calendar.component';

describe('FxEconomicCalendarComponent', () => {
  let component: FxEconomicCalendarComponent;
  let fixture: ComponentFixture<FxEconomicCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FxEconomicCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FxEconomicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
