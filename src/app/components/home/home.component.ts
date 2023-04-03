import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private onComment!: Observable<any>;
  private onLike!: Observable<any>;
  postsEmmiter!: BehaviorSubject<Post[]>;

  posts: Post[] = [];
  public _isLoading: boolean = true;

  constructor(private postService: PostService) { }
  ngOnInit(): void {
    this.isLoading = true;
    // this.postService.getPosts().subscribe();
    this.postsEmmiter = this.postService.postsEmmiter;
    this.postsEmmiter.subscribe({
      next: (posts) => {
        this.posts = posts
        this.isLoading = false;
      }
    })
  }
  getPosts(): void {
    // this.postService.getPosts().subscribe();
  }

  add(): void {

  }

  delete(): void {

  }

  set isLoading(data: boolean) {
    this._isLoading = data
  }
}
