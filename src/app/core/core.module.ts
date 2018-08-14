import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PersonCreateDialogComponent } from './create-dialogs/person-create-dialog/person-create-dialog.component';
import { ProjectCreateDialogComponent } from './create-dialogs/project-create-dialog/project-create-dialog.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AuthInterceptor } from './services/http/auth-interceptor';
import { ErrorInterceptor } from './services/http/error-interceptor';

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
