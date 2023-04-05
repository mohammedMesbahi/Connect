import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent  implements OnInit{
  userId:any;
  constructor(private activatedRoute:ActivatedRoute,private route:Router){

  }
  ngOnInit(): void {
    // this.userId =this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe((param) =>{
      this.userId = param.get('id');
    })
  }
  btnclick(){
    this.route.navigate(['/home'],{ fragment:this.userId })
  }

}
