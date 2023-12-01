import { Component, Input } from '@angular/core';
import { FeedService } from '../feed.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-liked',
  templateUrl: './user-liked.component.html',
})
export class UserLikedComponent {
  @Input() user: any = null;
  posts: any[] = [];

  constructor(
    private feedService: FeedService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.feedService.getLikedFromUser(this.user.id)?.subscribe((res) => {
      this.posts = res;
      this.posts.forEach((post) => {
        this.user.liked.forEach((postLiked: any) => {
          if (post.id === postLiked.id) {
            post.alreadyLiked = true;
          }

          if (post.answerTo.id === postLiked.id) {
            post.answerTo.alreadyLiked = true;
          }
        });
      });
    });
  }

  goToProfile(username: string) {
    this.router.navigate([`/user/${username}`]);
  }

  sendToPost(id: string) {
    this.router.navigate([`/post/${id}`]);
  }

  likePost(postId: string) {
    this.feedService.likePost(this.user.id, postId)?.subscribe(() => {
      this.authService.getUserLoggedIn()?.subscribe((res) => {
        this.user = res;
        this.loadPosts();
      });
    });
  }
}
