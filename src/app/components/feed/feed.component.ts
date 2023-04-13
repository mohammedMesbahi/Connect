import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { PostService } from 'src/app/services/post.service';
import { Post, Notification, Reaction, Comment } from 'src/app/shared/_models';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {
  private onComment!: Observable<any>;
  private onLike!: Observable<any>;
  postsEmmiter!: BehaviorSubject<Post[]>;
  arrayOfSubscriptions!: Subscription[]
  posts!: Post[];
  notifications!: Notification[];
  private _isLoading!: boolean;
  public get isLoading(): boolean {
    return this._isLoading;
  }
  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  constructor(private activatedRout: ActivatedRoute,
    private postService: PostService,
    private notificationService: NotificationService
  ) { }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe())
  }
  ngOnInit(): void {
    this._isLoading = true;
    this.arrayOfSubscriptions = [] as Subscription[]

    this.posts = [];
    this.notifications = [];

    this.arrayOfSubscriptions.push(this.postService.postsEmmiter.subscribe({
      next: (posts) => {
        this.posts = posts
        this._isLoading = false;
      }
    }))

    if (this.postService.getPostsFromLocalStorage()) {
      this.postService.postsEmmiter.next(this.postService.getPostsFromLocalStorage())
    } else {
      this.isLoading = true;
      this.postService.getPostsFromTheServer().subscribe({
        next: (posts: Post[]) => {
          this.posts = posts;
          this.postService.savePostsInLocalStorage(posts);
          this.isLoading = false;
        }
      })
    }

    if (this.notificationService.getNotificationsFromLocalStorage()) {
      this.notifications = this.notificationService.getNotificationsFromLocalStorage()
    } else {
      this.isLoading = true;
      this.notificationService.getNotificationsFromTheServer().subscribe({
        next: (notifications: Notification[]) => {
          this.notifications = notifications;
          this.notificationService.saveNotificationsInLocalStorage(notifications);
          this.isLoading = false;
        }
      })
    }


    /* this.arrayOfSubscriptions.push(this.postService.postsEmmiter.subscribe({
      next: (posts) => {
        this.posts = posts;
        this._isLoading = false;
      }
    })) */

    this.arrayOfSubscriptions.push(this.notificationService.newNotification().subscribe((data: { notification: Notification, body: Comment | Reaction }) => {
      if (data.notification.type == 'comment') {

        let postId = data.notification.url.split('#')[1];
        let comment = data.body as Comment;

        let index = this.posts.findIndex(p => p._id == postId);
        if (index != -1) {
          this.posts[index].comments.push(comment);
        }
      } else if (data.notification.type == 'reaction') {
        let postId = data.notification.url.split('#')[1];
        let reaction = data.body as Reaction;

        let index = this.posts.findIndex(p => p._id == postId);
        if (index != -1) {
          this.posts[index].reactions.push(reaction);
        }
      }
      this.notifications.push(data.notification);
    }))



  }
}



