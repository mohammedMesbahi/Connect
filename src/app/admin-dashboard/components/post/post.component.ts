import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  @Input('post') post!: Post;
  postCaption!:string;
  moreCaption!:boolean;
  ngOnInit(): void {
    this.moreCaption = false;
    this.postCaption = this.transform(this.post.caption,300);
  }
  transform(value: string, limit?: number): any {
    if (!value)
      return null
    let actualLimit = limit ? limit : 50;
    return value.substring(0, actualLimit)
  }
  changeCaptionLength() {
    this.moreCaption = !this.moreCaption;
    this.postCaption = this.moreCaption ? this.post.caption : this.transform(this.post.caption, 300)
  }
}
