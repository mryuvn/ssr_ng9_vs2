import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerTemplateComponent } from './color-picker-template.component';

describe('ColorPickerTemplateComponent', () => {
  let component: ColorPickerTemplateComponent;
  let fixture: ComponentFixture<ColorPickerTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
