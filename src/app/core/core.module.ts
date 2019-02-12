import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FreshdeskComponent } from '@app/core/freshdesk/freshdesk.component';
import { SharedModule } from '../shared/shared.module';
import { InternshipCreateDialogComponent } from './create-dialogs/internship-create-dialog/internship-create-dialog.component';
import { PersonCreateDialogComponent } from './create-dialogs/person-create-dialog/person-create-dialog.component';
import { ProjectCreateDialogComponent } from './create-dialogs/project-create-dialog/project-create-dialog.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SavePromptDialogComponent } from './save-prompt-dialog/save-prompt-dialog.component';
import { AuthInterceptor } from './services/http/auth-interceptor';
import { ErrorInterceptor } from './services/http/error-interceptor';


@NgModule({
  imports: [
    SharedModule,
    RouterModule,
  ],
  declarations: [
    FreshdeskComponent,
    HeaderComponent,
    InternshipCreateDialogComponent,
    NotFoundPageComponent,
    PersonCreateDialogComponent,
    ProjectCreateDialogComponent,
    SavePromptDialogComponent,
  ],
  entryComponents: [
    InternshipCreateDialogComponent,
    PersonCreateDialogComponent,
    ProjectCreateDialogComponent,
    SavePromptDialogComponent,
  ],
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
        ErrorInterceptor.inject(),
      ],
    };
  }
}
