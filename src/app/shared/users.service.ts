import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private urlAPI = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<User[]>(this.urlAPI);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.urlAPI}/${id}`);
  }

}
