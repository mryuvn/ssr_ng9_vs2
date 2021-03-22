import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNumberSelectedComponent } from './product-number-selected.component';

describe('ProductNumberSelectedComponent', () => {
  let component: ProductNumberSelectedComponent;
  let fixture: ComponentFixture<ProductNumberSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductNumberSelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNumberSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
