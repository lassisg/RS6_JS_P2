import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../shared/role';
import { User } from '../shared/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestrictedGuard implements CanActivate {

  user!: User;
  isAdministrator: boolean = false;

  constructor(private authService: AuthService, private router: Router) {

    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.isAdministrator = user.role === Role.Admin;
    });

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.user) {
      if (!this.isAdministrator) {
        this.router.navigate(['']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
    return false;

  }

}
