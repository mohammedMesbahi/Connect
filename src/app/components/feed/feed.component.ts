import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-feed',
  templateUrl:
    './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
/*   constructor(private authService: AuthService, private router: Router, private dataService: DataService,
    public matDialog: MatDialog) {

  }

  ngOnInit(): void {

  }

  logOut() {
    this.authService.logOut().subscribe({ next: () => this.router.navigate(['login']) });
  }
  openCreat() {
    const dialogRef = this.matDialog.open(CreateComponent, {
      width: '40%',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnDestroy(): void {
    this.dataService.clearLocalStorege();
  } */
}
