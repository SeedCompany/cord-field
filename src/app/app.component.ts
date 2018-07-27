import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthInterceptor } from './core/services/http/auth-interceptor';
import { SubscriptionComponent } from './shared/components/subscription.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionComponent implements OnInit {

  constructor(
    private authInterceptor: AuthInterceptor,
    private auth: AuthenticationService,
    private router: Router,
    private dialogs: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.authInterceptor.authError
      .takeUntil(this.unsubscribe)
      .filter(() => this.router.url !== '/login') // Ignore login errors
      .subscribe(async () => {
        this.dialogs.closeAll();
        await this.auth.logout();
        await this.auth.setNextUrl(this.router.url);
        this.router.navigateByUrl('/login', {replaceUrl: true});
      });
  }
}
