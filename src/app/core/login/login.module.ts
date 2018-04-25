import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
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
    RequestAccessComponent,
    ConfirmEmailComponent
  ]
})
export class LoginModule {
}
