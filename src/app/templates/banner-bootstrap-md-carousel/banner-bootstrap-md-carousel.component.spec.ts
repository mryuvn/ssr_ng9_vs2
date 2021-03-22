import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerBootstrapMdCarouselComponent } from './banner-bootstrap-md-carousel.component';

describe('BannerBootstrapMdCarouselComponent', () => {
  let component: BannerBootstrapMdCarouselComponent;
  let fixture: ComponentFixture<BannerBootstrapMdCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerBootstrapMdCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerBootstrapMdCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
