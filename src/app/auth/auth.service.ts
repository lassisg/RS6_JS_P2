import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../shared/user';
import { Role } from '../shared/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlAPI = `${environment.apiUrl}/users`;

  private userSubject = new BehaviorSubject<User>(
    JSON.parse(localStorage.getItem('user')!));

  constructor(private http: HttpClient, private router: Router) { }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  login(email: string, password: string) {

    return this.http.get<User[]>(
      `${this.urlAPI}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      { observe: 'response' })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user.body?.at(0)!));
        this.userSubject.next(user.body?.at(0)!);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null!);
    this.router.navigate(['']);
  }

  isAdmin() {
    return this.userSubject && this.userSubject.pipe(map(u => u.role === Role.Admin));
  }

}
