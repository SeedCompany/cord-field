import { inject, TestBed } from '@angular/core/testing';
import { CoreTestModule } from '@app/core/core-test.module';
import { CoreModule } from '@app/core/core.module';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        CoreTestModule,
      ],
    });
  });

  it('should be created', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));
});
