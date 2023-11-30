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
  user: any = null;
  answers: any[] = [];
  offset: number = 0;
  answerContent: string = '';

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
          this.loadUser();
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

  reply() {
    if (this.answerContent.trim()) {
      this.feedService
        .newPost(this.user.id, this.answerContent.trim(), this.postId)
        ?.subscribe(() => {
          location.reload();
          this.answerContent = '';
        });
    }
  }

  updateAnswers(postId: string) {
    this.feedService
      .findAnswers(this.postId, 0, this.answers.length)
      ?.subscribe((res) => {
        this.answers.forEach((answer) => {
          if (answer.id === postId) {
            if (answer.alreadyLiked) {
              answer.alreadyLiked = false;
            } else {
              answer.alreadyLiked = true;
            }
          }

          res.content.forEach((answerRes: any) => {
            if (answer.id === answerRes.id) {
              answer.likes = answerRes.likes;
            }
          });
        });
      });
  }

  loadUser() {
    this.authService.getUserLoggedIn()?.subscribe((res) => {
      this.user = res;
      this.checkLikedPosts();
      this.loadAnswers();
    });
  }

  checkLikedPosts() {
    this.user.liked.forEach((postLiked: any) => {
      if (this.post.id === postLiked.id) {
        this.post.alreadyLiked = true;
      }

      if (this.post.answerTo && this.post.answerTo.id === postLiked.id) {
        this.post.answerTo.alreadyLiked = true;
      }
    });
  }

  loadAnswers() {
    this.feedService.findAnswers(this.postId, this.offset)?.subscribe((res) => {
      if (res) {
        res.content.forEach((answer: any) => {
          this.user.liked.forEach((post: any) => {
            if (post.id === answer.id) {
              answer.alreadyLiked = true;
            }
          });
          this.answers.push(answer);
        });

        this.offset++;
      }
    });
  }

  sendToPost(id: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/post/${id}`]);
    });
  }

  likePost(postId: string, isAnswer?: boolean) {
    this.feedService.likePost(this.user.id, postId)?.subscribe((res) => {
      if (!isAnswer) {
        this.loadPost();
      } else {
        this.updateAnswers(postId);
      }
    });
  }

  goToProfile(username: string) {
    this.router.navigate([`/user/${username}`]);
  }
}
