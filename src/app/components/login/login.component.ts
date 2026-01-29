import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {

  @Input() user!: User;

  @ViewChild('emailInput') emailInputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInputElement!: ElementRef<HTMLInputElement>;

  formTitle: string = "Controlo de Acessos";
  formLogin!: FormGroup;
  invalidLogin: boolean = false;

  constructor(private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^\\w+([\\.-_\\+]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,10})+$')]),
      password: new FormControl('', Validators.required)
    });

    setTimeout(() => this.emailInputElement.nativeElement.focus(), 30);
  }


  logUserIn() {

    this.authService.login(this.formLogin.value)
      .subscribe({
        next: response => {
          this.user = response.body?.at(0)!;

          if (this.user) {
            this.activeModal.close();
          } else {
            console.log("Falha");
            this.invalidLogin = true;
            this.formLogin.setErrors({ 'invalid': true })
          }
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          setTimeout(() => this.emailInputElement.nativeElement.focus(), 30);

        }
      });
  }

}
