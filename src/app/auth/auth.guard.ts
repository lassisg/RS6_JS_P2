import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  user!: User | null;
  isAdministrator: boolean = false;

  constructor(private authService: AuthService, private router: Router, private location: Location) {

    this.authService.getUser().subscribe(user => {
      this.user = user;
    });

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let routeUserId = Number(route.paramMap.get('id'));
    let loggedUserId = this.user?.id;

    if (this.user && this.user.active && routeUserId === loggedUserId) {
      return true;
    }

    this.location.back();
    return false;

  }

}
