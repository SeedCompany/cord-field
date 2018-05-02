import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AuthenticationGuard } from './route-guards/authentication-guard';
import { AuthenticationStorageService } from './services/authentication-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { BrowserService } from './services/browser.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { AuthInterceptor } from './services/http/auth-interceptor';
import { PloApiService } from './services/http/plo-api.service';
import { ProfileApiService } from './services/http/profile-api.service';
import { LanguageService } from './services/language.service';
import { LocationService } from './services/location.service';
import { LoggerService } from './services/logger.service';
import { PartnerService } from './services/partner.service';
import { ProjectService } from './services/project.service';
import { LocalStorageService, SessionStorageService } from './services/storage.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundPageComponent
  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    AuthenticationStorageService,
    BrowserService,
    GoogleAnalyticsService,
    LanguageService,
    LocalStorageService,
    LocationService,
    LoggerService,
    PartnerService,
    PloApiService,
    ProjectService,
    ProfileApiService,
    SessionStorageService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() private parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }
}

/**
 * Do not include these in CoreModule or you'll break all the tests that mock http calls
 */
export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
