import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private _posts: any;
  public _isLoading: boolean = true;
  subscription!: Subscription;
  user!: User;
  userId!: string;
  followOrUnfollow:string = 'follow';
  constructor(private postService: PostService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
     private route: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.userId = param.get('id') as string;
      this.userService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        this._posts = this.postService.getPostsById(this.userId);
        this.followOrUnfollow = user.following?.includes(this.userService.myProfile()._id as string) ? 'unfollow' : 'follow';
        this.isLoading = false;
      });

    })

  }
  get posts(): any {
    return this._posts;
  }
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(data: boolean) {
    this._isLoading = data
  }

}
