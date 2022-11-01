import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../shared/models/user';
import { Role } from '../shared/models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlAPI = `${environment.apiUrl}/users`;

  private userSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('user')!));

  constructor(private http: HttpClient, private router: Router) { }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  login(user: User) {

    return this.http.get<User[]>(
      `${this.urlAPI}?email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}&active=true`,
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
    // FIXME: 4. Error when isAdmin returns null
    return this.userSubject && this.userSubject.pipe(map(u => u!.role === Role.Admin));
    // return this.userSubject.getValue() && this.userSubject.pipe(map(u => u!.role === Role.Admin));

  }

}
