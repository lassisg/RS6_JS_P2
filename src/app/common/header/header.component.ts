import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../content/login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() loginFormVisible: EventEmitter<boolean> = new EventEmitter();

  isAdministrator: boolean = false;
  user!: User | null;
  erro: string = '';

  constructor(private authService: AuthService, private modalService: NgbModal) {

    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.checkAdminRole();
    });

  }

  ngOnInit(): void {
  }

  logUserOut() {
    this.authService.logout();
  }

  openLoginForm() {
    const modalRef = this.modalService.open(LoginComponent);
    modalRef.componentInstance.user = this.user;
  }

  checkAdminRole() {

    this.authService.isAdmin()
      .pipe(first())
      .subscribe({
        next: isAdmin => {
          this.isAdministrator = isAdmin;
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;

        }
      });
  }

}
