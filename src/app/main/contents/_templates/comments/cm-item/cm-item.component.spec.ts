import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmItemComponent } from './cm-item.component';

describe('CmItemComponent', () => {
  let component: CmItemComponent;
  let fixture: ComponentFixture<CmItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
