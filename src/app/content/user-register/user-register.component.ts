import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/shared/models/role';
import { Location } from '@angular/common';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  title: string = "Registo de utilizador";
  formUser!: FormGroup;

  constructor(private servUser: UsersService, private location: Location) { }

  ngOnInit(): void {
    this.bindForm();
  }

  bindForm() {
    this.formUser = new FormGroup({
      name: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[-.\'\\w\u00C0-\u00FF ]{3,50}')]
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email]
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),]
      }),
      address: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[-.,\:\;\'\\w\u00C0-\u00FF ]{3,100}')]
      }),
      zip_code: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('\\d{4}-\\d{3}')]
      }),
      country: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[-.\'\\w\u00C0-\u00FF ]{3,50}')]
      })
    });
  }

  addUser() {

    if (this.formUser.valid) {
      this.formUser.addControl('role', new FormControl(Role.User));
      this.formUser.addControl('active', new FormControl(false));

      this.servUser.addUser(this.formUser.value)
        .subscribe({
          next: resultado => {
            console.log(`'${resultado.name}' adicionado!`);
            this.formUser.reset();
            this.location.back();
          }
        });

    } else {
      alert("Formulário inválido!");
    }
  }

}
