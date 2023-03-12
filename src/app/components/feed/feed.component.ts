import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit,OnDestroy{
  constructor(private authService:AuthService,private router:Router,private dataService:DataService){

  }
  ngOnDestroy(): void {
    this.dataService.clearLocalStorege();
  }
  ngOnInit(): void {
    this.dataService.loadChats().subscribe();
  }
  private _view:string = "messages";
  get view(){
    return this._view
  }
  set view(data: string) {
    this._view = data;
  }
  changeView(value:string){
    this._view=value
  }
  logOut(){
    this.authService.logOut().subscribe({next:()=>this.router.navigate(['login'])});
  }

}
