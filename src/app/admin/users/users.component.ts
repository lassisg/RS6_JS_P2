import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user!: User;
  isAdministrator: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.checkAdminRole();
    });
  }

  ngOnInit(): void {
  }

  checkAdminRole() {
    this.authService.isAdmin()
      .pipe(first()).subscribe(isAdmin => {
        this.isAdministrator = isAdmin;
      });
  }

}
