import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/shared/services/users.service';
import { User } from 'src/app/shared/models/user';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  title: string = "Atualização de dados";
  userId!: number;
  user!: User | null;
  erro: string = '';
  formUser!: FormGroup;

  constructor(private authService: AuthService, private servUser: UsersService, private activeRoute: ActivatedRoute) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.activeRoute.snapshot.paramMap.get("id"));
    this.readUserData();
    this.bindForm();
  }

  readUserData() {
    this.servUser.getUserById(this.userId)
      .subscribe({
        next: response => {
          this.user = response;
          console.log('init ', this.user);
          this.fillForm();
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
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

  fillForm() {

    this.formUser.setValue({
      name: this.user!.name,
      email: this.user!.email,
      password: this.user!.password,
      address: this.user!.address,
      zip_code: this.user!.zip_code,
      country: this.user!.country
    });
  }

  updateUser() {

    if (this.formUser.valid) {
      this.formUser.addControl('role', new FormControl(this.user!.role));
      this.formUser.addControl('active', new FormControl(this.user!.active));

      this.servUser.updateUser(this.userId, this.formUser.value)
        .subscribe({
          next: response => {
            console.log(response);
            this.user = response;
            console.log(`'${response.name}' atualizado!`);
          }
        });

    } else {
      alert("Formulário inválido!");
    }
  }

}
