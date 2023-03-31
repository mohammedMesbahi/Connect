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
  openCreat(){
    const dialogRef = this.matDialog.open(CreateComponent,{
      position: { top: '-40%', left: '30%' },
      width: '40%',
      height: '50vh',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
