import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: String = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      (res) => {
        localStorage.setItem("token", res.token);
        this.router.navigate(['/'])
      },
      (err) => {
        this.errorMessage = 'login ou senha inválido.';
      }
    );
  }

  onChange() {
    this.errorMessage = '';
  }
}
