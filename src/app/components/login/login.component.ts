import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'src/app/shared/models/role';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() user!: User;

  @ViewChild('emailInput') emailInputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInputElement!: ElementRef<HTMLInputElement>;

  formTitle: string = "Controlo de Acessos";
  formLogin!: FormGroup;

  private startUpUser: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: Role.User,
    address: '',
    zip_code: '',
    country: '',
    active: false
  }

  constructor(private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

    if (!this.user) {
      this.user = this.startUpUser;
    }

    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^\\w+([\\.-_\\+]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,10})+$')]),
      password: new FormControl('', Validators.required)
    });

    setTimeout(() => this.emailInputElement.nativeElement.focus(), 30);
  }


  logUserIn() {
    console.log(this.formLogin.value);

    this.authService.login(this.formLogin.value)
      .subscribe({
        next: response => {
          console.log(response);
          this.user = response.body?.at(0)!;

          if (this.user) {
            this.activeModal.close();
          }
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          setTimeout(() => this.emailInputElement.nativeElement.focus(), 30);

        }
      });
  }

}
