import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/_models';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit,OnDestroy {
  private onComment!: Observable<any>;
  private onLike!: Observable<any>;
  postsEmmiter!: BehaviorSubject<Post[]>;
  arrayOfSubscriptions!:Subscription[]
  posts: Post[] = [];
  private _isLoading!: boolean;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  constructor(private activatedRout: ActivatedRoute, private postService: PostService) { }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe())
  }
  ngOnInit(): void {
    this.arrayOfSubscriptions = [] as Subscription[]
    this._isLoading = true;
    this.arrayOfSubscriptions.push(this.postService.postsEmmiter.subscribe({
      next: (posts) => {
        this.posts = posts
        this._isLoading = false;
      }
    }))
    if (this.postService.getPostsFromLocalStorage()) {
      this.postService.postsEmmiter.next(this.postService.getPostsFromLocalStorage())
    } else {
      this.postService.getPostsFromTheServer().subscribe({
        next:(posts:Post[]) => {
          this.postService.savePostsInLocalStorage(posts);
        }
      })
    }

  }
}



