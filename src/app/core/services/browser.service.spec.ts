import { inject, TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { CoreModule } from '../core.module';
import { BrowserService } from './browser.service';

describe('BrowserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CoreTestModule,
      ],
    });
  });

  it('should be created', inject([BrowserService], (service: BrowserService) => {
    expect(service).toBeTruthy();
  }));
});
