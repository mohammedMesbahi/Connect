import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post, User } from 'src/app/_models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy{
  private _posts:any;
  public _isLoading!:boolean;
  subscription!:Subscription;
  me!:User;
  arrayOfSubscriptions!:Subscription[]
  constructor(private postService:PostService,private userService:UserService){}
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe())
  }
  ngOnInit(): void {
    this._isLoading=true;
    this.me = this.userService.myProfile();
    this.arrayOfSubscriptions = [] as Subscription[]
    // Perform any initialization tasks here.
    this.arrayOfSubscriptions.push(this.postService.postsEmmiter.subscribe({
      next: (posts) => {
        this._posts = posts.filter(p => p.owner._id == this.me._id);
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
  get posts():any{
    return this._posts;
  }
  get isLoading(){
    return this._isLoading;
  }
  set isLoading(data:boolean){
    this._isLoading=data
  }

}
