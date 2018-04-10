import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private auth: AuthenticationService,
              private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const loggedIn = await this.auth.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    return loggedIn;
  }
}
