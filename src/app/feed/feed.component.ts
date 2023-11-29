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
  user: any = null;
  postContent: string = '';

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
          this.loadUser();
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

  loadUser() {
    this.authService.getUserLoggedIn()?.subscribe((res) => {
      this.user = res;
      this.checkLikedPosts();
    });
  }

  checkLikedPosts() {
    this.posts.forEach((post) => {
      this.user.liked.forEach((postLiked: any) => {
        if (post.id === postLiked.id) {
          post.alreadyLiked = true;
        }

        if (post.answerTo && post.answerTo.id === postLiked.id) {
          post.answerTo.alreadyLiked = true;
        }
      });
    });
  }

  sendToPost(id: string) {
    this.router.navigate([`/post/${id}`]);
  }

  innerFunction(event: Event) {
    event.stopPropagation();
  }

  post() {
    this.feedService.newPost(this.user.id, this.postContent)?.subscribe(() => {
      this.loadPosts();
    });

    this.postContent = '';
  }

  likePost(postId: string) {
    this.feedService.likePost(this.user.id, postId)?.subscribe((res) => {
      this.loadPosts();
    });
  }

  mouseEnter(parentDiv: Element) {
    parentDiv.classList.add('highlight');
  }

  mouseLeave(parentDiv: Element) {
    parentDiv.classList.remove('highlight');
  }
}
