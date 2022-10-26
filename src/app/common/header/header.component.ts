import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() loginFormVisible: EventEmitter<boolean> = new EventEmitter();

  isUserLoggedIn: boolean = false;
  isAdministrator: boolean = false;
  authFail: boolean = false;
  modalVisible: boolean = false;
  user!: User;
  erro: string = '';

  constructor(private authService: AuthService) {

    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.checkAdminRole();
    });

  }

  ngOnInit(): void {
  }

  toggleLoginForm(visible: boolean) {
    this.modalVisible = visible;
  }

  logUserIn(user: User) {

    this.authService.login(user.email, user.password)
      .subscribe({
        next: response => {
          this.user = response.body?.at(0)!;

          if (this.user) {
            this.checkAdminRole();
            this.toggleLoginForm(false);

          } else {
            this.authFail = true;
            setTimeout(() => this.authFail = false, 3000)

          }
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;

        }
      });
  }

  logUserOut() {
    this.authService.logout();
  }

  checkAdminRole() {
    this.authService.isAdmin()
      .pipe(first()).subscribe(isAdmin => {
        this.isAdministrator = isAdmin;
      });
  }

}
