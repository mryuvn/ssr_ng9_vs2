import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarTemplateComponent } from './avatar-template.component';

describe('AvatarTemplateComponent', () => {
  let component: AvatarTemplateComponent;
  let fixture: ComponentFixture<AvatarTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
