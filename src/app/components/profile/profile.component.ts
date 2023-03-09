import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private _posts:any;
  public _isLoading:boolean = true;

  constructor(private dataservice:DataService){}
  ngOnInit(): void {
    // Perform any initialization tasks here.
    this.dataservice.getPosts().subscribe({
      next:(data)=>{
        this._posts=data;
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
