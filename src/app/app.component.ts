import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Project-frontEnd';
  constructor(private activatedRout:ActivatedRoute){

  }
  ngOnInit(): void {
    this.activatedRout.fragment.subscribe((post:any) => {
      this.jumpTo(post)
    })
  }
  jumpTo(post:any){
    document.getElementById(post)?.scrollIntoView({behavior:'smooth'})
  }
}
