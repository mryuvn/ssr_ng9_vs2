import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorDataComponent } from './visitor-data.component';

describe('VisitorDataComponent', () => {
  let component: VisitorDataComponent;
  let fixture: ComponentFixture<VisitorDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
