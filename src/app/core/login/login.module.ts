import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { RequestAccessComponent } from './request-access/request-access.component';

@NgModule({
  imports: [
    SharedModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent,
    RequestAccessComponent
  ]
})
export class LoginModule {
}
