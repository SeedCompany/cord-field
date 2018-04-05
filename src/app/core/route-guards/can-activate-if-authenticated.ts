import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CanActivateIfAuthenticated implements CanActivate {

  constructor(private auth: AuthenticationService,
              private route: ActivatedRoute,
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
