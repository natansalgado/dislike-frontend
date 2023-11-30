import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user: User = {
    name: '',
    username: '',
    email: '',
    password: '',
  };
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private location: Location
  ) {}

  onSubmit() {
    this.http.post('http://localhost:8080/api/users', this.user).subscribe(
      (response) => {
        this.login();
      },
      (error) => {
        if (error.error == 'Email is already in use') {
          this.errorMessage = 'Esse email já está em uso.';
        } else if (error.error == 'Username is already in use') {
          this.errorMessage = 'Esse usuário já está em uso.';
        } else {
          this.errorMessage = error.error;
        }
      }
    );
  }

  login() {
    this.authService
      .login(this.user.username, this.user.password)
      .subscribe((res) => {
        localStorage.setItem('token', res.token);
        this.location.back();
      });
  }
}
