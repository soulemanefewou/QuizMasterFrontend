import { TestBed } from '@angular/core/testing';

import { Attempt } from './attempt';

describe('Attempt', () => {
  let service: Attempt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Attempt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
