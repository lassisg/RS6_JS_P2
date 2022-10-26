import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() loginError: boolean = false;
  @Input() focusEmail: boolean = true;

  @ViewChild('emailInput') emailInputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInputElement!: ElementRef<HTMLInputElement>;

  @Output() loginFormVisible: EventEmitter<boolean> = new EventEmitter();
  @Output() loginData: EventEmitter<User> = new EventEmitter();

  formLogin!: FormGroup;
  formTitle: string = "Controlo de Acessos";

  constructor() { }

  ngOnInit(): void {

    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^\\w+([\\.-_\\+]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,10})+$')]),
      password: new FormControl('', Validators.required)
    });

    setTimeout(() => this.emailInputElement.nativeElement.focus(), 30);
  }

  hideLoginForm() {
    this.loginFormVisible.emit(false);
  }

  loginUser() {
    if (this.formLogin.valid) {
      this.loginData.emit(this.formLogin.value);
      if (this.loginError) {
        setTimeout(() => this.emailInputElement.nativeElement.focus(), 30);
      }
    }
  }

}
