import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsTemplateComponent } from './chips-template.component';

describe('ChipsTemplateComponent', () => {
  let component: ChipsTemplateComponent;
  let fixture: ComponentFixture<ChipsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
