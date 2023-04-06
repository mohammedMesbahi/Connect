import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
        this._posts = this.postService.getPostsFromLocalStorage().filter(p => p.owner._id == this.me._id);
        this._isLoading = false;
      }
    }))


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
