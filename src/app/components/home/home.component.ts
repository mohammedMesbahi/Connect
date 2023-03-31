import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Post } from '../post/post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _posts:Post | undefined;
  public _isLoading:boolean = true;

  constructor(private dataservice:DataService){}
  ngOnInit(): void {
    // Perform any initialization tasks here.
    /* this.dataservice.getPosts().subscribe({
      next:(data)=>{
        this._posts=data;
        this._isLoading=false;
      }
    }) */

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
