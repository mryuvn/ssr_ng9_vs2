import { TestBed } from '@angular/core/testing';

import { SetTagsService } from './set-tags.service';

describe('SetTagsService', () => {
  let service: SetTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
