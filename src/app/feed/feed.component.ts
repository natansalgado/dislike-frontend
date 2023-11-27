import { Component } from '@angular/core';
import { FeedService } from '../feed.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
})
export class FeedComponent {
  posts: any[] = [];
  token: string | null = null;
  error: boolean = false;

  constructor(
    private feedService: FeedService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.token = this.authService.getToken();

    if (this.token) {
      this.feedService.getPosts(this.token).subscribe(
        (res) => {
          this.posts = res;
          console.log(res);
        },
        (err) => {
          if (err.status == 403 && this.token) {
            this.authService.deleteToken();
          }
          this.error = true;
        }
      );
    }
  }

  sendToPost(id: string) {
    this.router.navigate([`/post/${id}`]);
  }

  innerFunction(event: Event) {
    event.stopPropagation();
    console.log('Clicou no botão interno');
  }

  mouseEnter(parentDiv: Element) {
    parentDiv.classList.add('highlight')
  }

  mouseLeave(parentDiv: Element) {
    parentDiv.classList.remove('highlight')
  }
}
