import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/_models';

@Component({
  selector: 'app-admindashboar',
  templateUrl: './admindashboar.component.html',
  styleUrls: ['./admindashboar.component.css']
})
export class AdmindashboarComponent  {
  arrayOfSubscriptions!: Subscription[]

}
