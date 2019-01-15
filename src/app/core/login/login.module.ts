import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    SharedModule,
    LoginRoutingModule,
  ],
  declarations: [
    ConfirmEmailComponent,
    ForgotPasswordComponent,
    LoginComponent,
    ResetPasswordComponent,
  ],
})
export class LoginModule {
}
