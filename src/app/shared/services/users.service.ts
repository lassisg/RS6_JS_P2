import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private urlAPI = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  addUser(user: User) {
    return this.http.post<User>(this.urlAPI, user);
  }

  updateUser(userId: number, user: User) {
    return this.http.put<User>(`${this.urlAPI}/${userId}`, user);
  }

  getAllUsers() {
    return this.http.get<User[]>(this.urlAPI);
  }

  getAllUsersExcept(id: number) {
    return this.http.get<User[]>(`${this.urlAPI}?id_ne=${id}`);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.urlAPI}/${id}`);
  }

  searchUsers(userId: number, searchParam: string, searchTerm: string) {
    return this.http.get<User[]>(
      `${this.urlAPI}?id_ne=${userId}&${searchParam}_like=${searchTerm}`,
      { observe: 'response' });
  }

}
