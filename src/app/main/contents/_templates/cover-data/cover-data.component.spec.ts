import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverDataComponent } from './cover-data.component';

describe('CoverDataComponent', () => {
  let component: CoverDataComponent;
  let fixture: ComponentFixture<CoverDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
