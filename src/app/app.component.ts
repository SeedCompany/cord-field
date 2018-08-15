import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { observeComponentTitle, TitleProp } from './core/decorators';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthInterceptor } from './core/services/http/auth-interceptor';
import { SubscriptionComponent } from './shared/components/subscription.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionComponent implements OnInit {

  private title$ = new BehaviorSubject<string[]>([]);
  private titleSub = Subscription.EMPTY;

  constructor(
    private authInterceptor: AuthInterceptor,
    private auth: AuthenticationService,
    private router: Router,
    private dialogs: MatDialog,
    private titleService: Title
  ) {
    super();
  }

  ngOnInit(): void {
    this.authInterceptor.authError
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async () => {
        this.dialogs.closeAll();
        await this.auth.logout();
        await this.auth.setNextUrl(this.router.url);
        this.router.navigateByUrl('/login', {replaceUrl: true});
      });

    this.title$
      .pipe(
        takeUntil(this.unsubscribe),
        map(titles => titles
          .filter(t => t)
          .concat(['Cord Field'])
          .join(' - ')
        )
      )
      .subscribe(str => this.titleService.setTitle(str));
  }

  onRouterActivate(component: Partial<TitleProp>) {
    this.titleSub = observeComponentTitle(component)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(titles => this.title$.next(titles));
  }

  onRouterDeactivate() {
    this.titleSub.unsubscribe();
  }
}
