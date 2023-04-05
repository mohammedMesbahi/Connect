import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/messages.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  postsEmmiter!: BehaviorSubject<Post[]>;
  arrayOfSubscriptions!: Subscription[];

  posts: Post[] = [];
  isLoading: boolean = true;

  constructor(private activatedRout: ActivatedRoute, private postService: PostService, private messagesService: MessagesService) { }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
  ngOnInit(): void {
    this.arrayOfSubscriptions = []
    this.postService.getPosts().subscribe();
    this.arrayOfSubscriptions.push(
      this.postService.postsEmmiter.subscribe({
        next: (posts) => {
          this.posts = posts
          this.isLoading = false;
        }
      })
    )
  }

}
