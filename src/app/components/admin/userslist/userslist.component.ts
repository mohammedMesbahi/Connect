import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css']
})
export class UserslistComponent implements OnInit {
  users!:User[];
  constructor(private userService:UserService){
  }

  ngOnInit(): void {
    this.userService.getusers().subscribe(
      (users) => {
        this.users = users;
      }
    )
  }
}
