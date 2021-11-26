import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeEverywhereComponent } from './trade-everywhere.component';

describe('TradeEverywhereComponent', () => {
  let component: TradeEverywhereComponent;
  let fixture: ComponentFixture<TradeEverywhereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeEverywhereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeEverywhereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
