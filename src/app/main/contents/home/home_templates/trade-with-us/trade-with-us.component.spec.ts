import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeWithUsComponent } from './trade-with-us.component';

describe('TradeWithUsComponent', () => {
  let component: TradeWithUsComponent;
  let fixture: ComponentFixture<TradeWithUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeWithUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeWithUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
