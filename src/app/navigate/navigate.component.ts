import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
})
export class NavigateComponent {
  postId = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
    });
  }

  ngOnInit(): void {
    this.router.navigate([`/post/${this.postId}`]);
  }
}
