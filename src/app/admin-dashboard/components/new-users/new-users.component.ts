import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/shared.module';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent implements OnInit, OnDestroy {
  users!: User[];
  arrayOfSubscriptions!: Subscription[]

  constructor(private usersService: UsersService) {

  }
  ngOnInit(): void {
    this.users = [];
    this.arrayOfSubscriptions = [];
    this.arrayOfSubscriptions.push(
      this.usersService.getusers().subscribe({
        next: (users: User[]) => {
          this.users = users
        }
      })
    )

  }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
}
