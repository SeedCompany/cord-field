import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { LoginModule } from './login/login.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AuthenticationGuard } from './route-guards/authentication-guard';
import { AuthenticationStorageService } from './services/authentication-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { BrowserService } from './services/browser.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { PloApiService } from './services/http/plo-api.service';
import { ProfileApiService } from './services/http/profile-api.service';
import { LoggerService } from './services/logger.service';
import { ProjectService } from './services/project.service';
import { LocalStorageService, SessionStorageService } from './services/storage.service';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundPageComponent,
    WelcomeComponent
  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    AuthenticationStorageService,
    BrowserService,
    AuthenticationGuard,
    GoogleAnalyticsService,
    LocalStorageService,
    LoggerService,
    PloApiService,
    ProjectService,
    SessionStorageService,
    ProfileApiService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() private parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }
}
