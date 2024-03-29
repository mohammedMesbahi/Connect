import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/shared.module';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-newposts',
  templateUrl: './newposts.component.html',
  styleUrls: ['./newposts.component.css']
})
export class NewpostsComponent implements OnInit{
  constructor(private postsService:PostsService){}
  posts!: Post[];
  arrayOfSubscriptions!: Subscription[]
  ngOnInit(): void {
    this.arrayOfSubscriptions = [] as Subscription[]
    this.posts = [] as Post[]
    this.arrayOfSubscriptions.push(this.postsService.getPostsFromTheServer().subscribe({
      next: (posts:Post[]) => {
        this.posts = posts
        // this._isLoading = false;
      }
    }))
  }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe())
  }
}
