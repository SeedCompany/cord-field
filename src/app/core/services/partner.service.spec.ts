import { inject, TestBed } from '@angular/core/testing';

import { PartnerService } from './partner.service';

describe('PartnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartnerService]
    });
  });

  it('should be created', inject([PartnerService], (service: PartnerService) => {
    expect(service).toBeTruthy();
  }));
});
