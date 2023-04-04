import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/messages.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  showNotifications = false;
  showSearch = false;
  newMessagesObs!: BehaviorSubject<string>;
  newmessagesCounter = -1;
  arrayOfSubscriptions!: Subscription[];



  constructor(private messagesService: MessagesService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public matDialog: MatDialog) {

  }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
  ngOnInit(): void {
    this.arrayOfSubscriptions = [];
    this.arrayOfSubscriptions.push(
      this.messagesService.newMessage.subscribe(() => {
      this.newmessagesCounter++;
    }),

    this.activatedRoute.url.subscribe(u => {
      if (u.toString().includes('messages')) {
        this.newmessagesCounter = 0;
      }
    })
    )

  }

  public toggleNotifications() {
    this.showNotifications = !this.showNotifications
  }

  public toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  logOut() {
    this.authService.logOut().subscribe({ next: () => {
      this.messagesService.disconnect();
      this.router.navigate(['/login'])
    } });
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
