import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HeaderSearchComponent } from './header-search/header-search.component';
import { HeaderComponent } from './header/header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
  ],
  declarations: [
    WelcomeComponent,
    NotFoundPageComponent,
    HeaderComponent,
    HeaderSearchComponent,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() private parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }
}
