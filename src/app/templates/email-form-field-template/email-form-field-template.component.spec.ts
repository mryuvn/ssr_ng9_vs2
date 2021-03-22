import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFormFieldTemplateComponent } from './email-form-field-template.component';

describe('EmailFormFieldTemplateComponent', () => {
  let component: EmailFormFieldTemplateComponent;
  let fixture: ComponentFixture<EmailFormFieldTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailFormFieldTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailFormFieldTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
