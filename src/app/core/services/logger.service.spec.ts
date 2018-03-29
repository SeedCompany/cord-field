import {inject, TestBed} from '@angular/core/testing';

import {LoggerService} from './logger.service';
import {GoogleAnalyticsService} from "./google-analytics.service";

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService, GoogleAnalyticsService]
    });
  });

  it('should be created', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));
});
