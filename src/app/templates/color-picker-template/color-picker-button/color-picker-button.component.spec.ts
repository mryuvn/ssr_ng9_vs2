import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerButtonComponent } from './color-picker-button.component';

describe('ColorPickerButtonComponent', () => {
  let component: ColorPickerButtonComponent;
  let fixture: ComponentFixture<ColorPickerButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
