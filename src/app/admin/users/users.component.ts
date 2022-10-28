import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/models/user';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  title: string = "Gestão de utilizadores";
  users: User[] = [];
  user!: User | null;
  isAdministrator: boolean = false;
  erro: string = "";

  // formUsers!: FormGroup;
  searchResult: User[] = [];
  searchParam: string = 'name';
  searchTerm: string = '';

  page: number = 1;
  pageSize: number = 10;
  pageUsers: User[] = [];

  constructor(private authService: AuthService, private servUser: UsersService) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.checkAdminRole();
    });
  }

  refreshUsers() {
    this.pageUsers = this.searchResult
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize);
  }

  ngOnInit(): void {
    this.readUsersData();
  }

  readUsersData() {
    this.servUser.getAllUsersExcept(this.user!.id)
      .subscribe({
        next: response => {
          this.users = response;
          this.pageUsers = [...this.users.slice(0, this.pageSize)];
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
  }

  changeSearchType(event: any) {
    this.searchParam = event.target.value;
    this.searchUser();
  }

  changeSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.searchUser();
  }

  searchUser() {

    this.servUser.searchUsers(this.user!.id, this.searchParam, this.searchTerm)
      .subscribe({
        next: response => {
          this.searchResult = response.body!;
          this.refreshUsers();
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });

  }

  toggleActive(user: User) {
    user.active = !user.active;

    this.servUser.updateUser(user.id, user)
      .subscribe({
        next: response => {
          console.log(`'${response.name}' ${response.active ? 'ativado' : 'desativado'}!`);
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });

  }

  checkAdminRole() {
    this.authService.isAdmin()!
      .pipe(first()).subscribe(isAdmin => {
        this.isAdministrator = isAdmin;
      });
  }

}
