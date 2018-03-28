import { inject, TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';
import { BrowserService } from './browser.service';

describe('BrowserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
      providers: [
        BrowserService
      ]
    });
  });

  it('should be created', inject([BrowserService], (service: BrowserService) => {
    expect(service).toBeTruthy();
  }));
});
