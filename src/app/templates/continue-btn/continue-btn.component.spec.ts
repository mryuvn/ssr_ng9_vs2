import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueBtnComponent } from './continue-btn.component';

describe('ContinueBtnComponent', () => {
  let component: ContinueBtnComponent;
  let fixture: ComponentFixture<ContinueBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContinueBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
