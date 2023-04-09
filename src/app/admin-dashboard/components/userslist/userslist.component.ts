import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css']
})
export class UserslistComponent implements OnInit,OnDestroy {
  users!:User[];
  arrayOfSubscriptions!: Subscription[]
  constructor(private userService:UserService){
  }

  ngOnInit(): void {
    this.users = [];
    this.arrayOfSubscriptions = [];
    this.userService.getusers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
}
