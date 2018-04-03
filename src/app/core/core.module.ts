import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HeaderSearchComponent } from './header-search/header-search.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BrowserService } from './services/browser.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { LoggerService } from './services/logger.service';
import { LocalStorageService, SessionStorageService } from './services/storage.service';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [
    WelcomeComponent,
    NotFoundPageComponent,
    HeaderComponent,
    HeaderSearchComponent
  ],
  providers: [
    BrowserService,
    GoogleAnalyticsService,
    LocalStorageService,
    LoggerService,
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
