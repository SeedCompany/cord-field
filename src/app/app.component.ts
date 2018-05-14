import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AuthInterceptor } from './core/services/http/auth-interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  constructor(private authInterceptor: AuthInterceptor,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authInterceptor.authError
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.router.navigateByUrl('/login');
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
