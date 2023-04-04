import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private _isLoading: boolean = true;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  constructor(private activatedRout: ActivatedRoute, private postService: PostService) { }
  ngOnInit(): void {
    this._isLoading = true;
    // this.postService.getPosts().subscribe();
    this.postsEmmiter = this.postService.postsEmmiter;
    this.postsEmmiter.subscribe({
      next: (posts) => {
        this.posts = posts
        this._isLoading = false;
      }
    })

  }
  jumpTo(post: any) {
    setTimeout(() => {
      const element = document.getElementById(post);
      if (element) {
        console.log(element);

        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2);
    // document.getElementById(post)?.scrollIntoView({ behavior: 'smooth' })
    // console.log(post);

  }
}

/* getPosts(): void {
  // this.postService.getPosts().subscribe();
}

add(): void {

}

delete(): void {

}

set isLoading(data: boolean) {
  this._isLoading = data
} */

