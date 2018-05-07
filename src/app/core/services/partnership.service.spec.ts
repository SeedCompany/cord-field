import { inject, TestBed } from '@angular/core/testing';

import { PartnershipService } from './partnership.service';

describe('PartnershipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartnershipService]
    });
  });

  it('should be created', inject([PartnershipService], (service: PartnershipService) => {
    expect(service).toBeTruthy();
  }));
});
