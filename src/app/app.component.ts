import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthInterceptor } from './core/services/http/auth-interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  constructor(private authInterceptor: AuthInterceptor,
              private auth: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authInterceptor.authError
      .takeUntil(this.ngUnsubscribe)
      .filter(() => this.router.url !== '/login') // Ignore login errors
      .subscribe(async () => {
        await this.auth.setNextUrl(this.router.url);
        this.router.navigateByUrl('/login', {replaceUrl: true});
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
