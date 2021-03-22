import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAutocompleteComponent } from './single-autocomplete.component';

describe('SingleAutocompleteComponent', () => {
  let component: SingleAutocompleteComponent;
  let fixture: ComponentFixture<SingleAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
