import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  constructor(private authService:AuthService,private router:Router){

  }
  private _view:string = "home";
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
