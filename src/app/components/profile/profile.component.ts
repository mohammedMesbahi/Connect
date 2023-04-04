import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy{
  private _posts:any;
  public _isLoading:boolean = true;
  subscription!:Subscription;
  me!:User;
  constructor(private postService:PostService,private userService:UserService){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.me = this.userService.myProfile();;
    // Perform any initialization tasks here.
    this.subscription = this.postService.postsEmmiter.subscribe({
      next:(data)=>{
        this._posts=data.filter(p => p.owner._id == this.me._id);
        this._isLoading=false;
      }
    })

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
