import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit,OnDestroy{
  constructor(private authService:AuthService,private router:Router,private dataService:DataService,
    public matDialog:MatDialog){

  }
  ngOnDestroy(): void {
    this.dataService.clearLocalStorege();
  }
  ngOnInit(): void {

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
  openCreat(){
    const dialogRef = this.matDialog.open(CreateComponent,{
      width: '40%',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
