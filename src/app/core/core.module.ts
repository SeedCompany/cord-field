import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PersonCreateDialogComponent } from './create-dialogs/person-create-dialog/person-create-dialog.component';
import { ProjectCreateDialogComponent } from './create-dialogs/project-create-dialog/project-create-dialog.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AlreadyLoggedInGuard, AuthenticationGuard } from './route-guards/authentication-guard';
import { NotImplementedGuard } from './route-guards/not-implemented.guard';
import { AuthenticationStorageService } from './services/authentication-storage.service';
import { AuthenticationService } from './services/authentication.service';
import { BrowserService } from './services/browser.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { AuthInterceptor } from './services/http/auth-interceptor';
import { ErrorInterceptor } from './services/http/error-interceptor';
import { PloApiService } from './services/http/plo-api.service';
import { LanguageService } from './services/language.service';
import { LocationService } from './services/location.service';
import { LoggerService } from './services/logger.service';
import { OrganizationService } from './services/organization.service';
import { ProjectService } from './services/project.service';
import { LocalStorageService, SessionStorageService } from './services/storage.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundPageComponent,
    PersonCreateDialogComponent,
    ProjectCreateDialogComponent
  ],
  providers: [
    AlreadyLoggedInGuard,
    AuthInterceptor,
    AuthenticationGuard,
    AuthenticationService,
    AuthenticationStorageService,
    BrowserService,
    GoogleAnalyticsService,
    LanguageService,
    LocalStorageService,
    LocationService,
    LoggerService,
    NotImplementedGuard,
    OrganizationService,
    PloApiService,
    ProjectService,
    SessionStorageService,
    UserService
  ],
  entryComponents: [
    PersonCreateDialogComponent,
    ProjectCreateDialogComponent
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() private parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthInterceptor.inject(),
        ErrorInterceptor.inject()
      ]
    };
  }
}
