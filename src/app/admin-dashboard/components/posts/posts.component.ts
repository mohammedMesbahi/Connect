import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit,OnDestroy {
  ngOnInit(): void {
    console.log('ngOnInit called PostsComponent.');
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy called PostsComponent.');
  }
}
