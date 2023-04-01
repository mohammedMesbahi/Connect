import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  public _isLoading:boolean = true;

  constructor(private postService:PostService){}
  ngOnInit(): void {
    this.getPosts();
  }
  getPosts(): void {
    this.postService.getPosts()
    .subscribe(posts => this.posts = posts);
  }

  add(): void {

  }

  delete(): void {

  }

  set isLoading(data:boolean){
    this._isLoading=data
  }
}
