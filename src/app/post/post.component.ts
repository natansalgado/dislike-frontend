import { Component } from '@angular/core';
import { FeedService } from '../feed.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
})
export class PostComponent {
  post: any = null;
  token: string | null = null;
  statusCode: number = 0;
  postId: string = '';

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadPost();

    this.location.onUrlChange((url: string) => {
      location.reload();
    });
  }

  loadPost() {
    this.token = this.authService.getToken();

    if (this.token) {
      this.feedService.getPost(this.postId, this.token).subscribe(
        (res) => {
          this.post = res;
          this.statusCode = 0;
        },
        (err) => {
          if (err.status == 403 && this.token) {
            this.authService.deleteToken();
          }
          this.statusCode = err.status;
        }
      );
    }
  }

  sendToPost(id: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/post/${id}`]);
    });
  }
}
