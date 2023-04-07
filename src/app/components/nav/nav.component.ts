import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/messages.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  showNotifications!: boolean;
  showSearch!: boolean;
  newmessagesCounter!: number;
  arrayOfSubscriptions!:Subscription[];

  constructor(private messagesService: MessagesService,
    private authService: AuthService, private router: Router,
    private dataService: DataService,
    public matDialog: MatDialog) { }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
  ngOnInit(): void {
    this.arrayOfSubscriptions = [];
    this.newmessagesCounter = 0;
    this.showNotifications = false;
    this.showSearch = false;
    this.arrayOfSubscriptions.push(this.messagesService.newMessage().subscribe({
      next:(data:any) => {
        if (data.message.sender != this.messagesService._id) {
          this.newmessagesCounter++
        }
      },
      error:console.log
    }))
  }
  public toggleNotifications() {
    this.showNotifications = !this.showNotifications
  }
  public toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  logOut() {
    this.authService.logOut().subscribe({ next: () => this.router.navigate(['login']) });
  }

  openCreatePostDialog() {
    const dialogRef = this.matDialog.open(CreateComponent, {
      width: '40%',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
