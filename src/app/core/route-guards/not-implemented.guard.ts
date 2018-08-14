import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot } from '@angular/router';
import { showNotImplemented } from '../../shared/directives/not-implemented.directive';
import { BrowserService } from '../services/browser.service';

@Injectable({
  providedIn: 'root'
})
export class NotImplementedGuard implements CanActivate {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private browserService: BrowserService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // redirect to homepage if loading this route at app/page load
    if (!this.browserService.firstNavigationFinished) {
      this.router.navigateByUrl('');
    }

    showNotImplemented(this.snackBar, route.data.message);

    return false;
  }
}

export function notImplementedRoute(message?: string): Route {
  // We have to return a new object for each route to keep the router happy
  return {
    path: '**',
    canActivate: [NotImplementedGuard],
    data: {message}
  };
}
