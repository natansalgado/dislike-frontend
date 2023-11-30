import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  userOfPage: any = null;
  user: any = null;
  username: string = '';
  active = 'posts';

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
    });
  }

  ngOnInit() {
    this.authService.getUserLoggedIn()?.subscribe(
      (res) => {
        this.user = res;
        console.log(JSON.stringify(res));
        
        this.loadUserOfPage();
      },
      (err) => {
        this.authService.deleteToken();
      }
    );
  }

  loadUserOfPage() {
    this.authService.getUserByUsername(this.username)?.subscribe((res) => {
      this.userOfPage = res;
    });
  }

  toggleActive(active: string) {
    this.active = active;
  }
}
