import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvatarTemplateComponent } from './user-avatar-template.component';

describe('UserAvatarTemplateComponent', () => {
  let component: UserAvatarTemplateComponent;
  let fixture: ComponentFixture<UserAvatarTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAvatarTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvatarTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
