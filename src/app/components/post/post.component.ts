import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input('post') post!: Post;


}
export interface Post {
  owner: Owner,
  caption: string
  media: string
  reactions: [
    {
      owner:Owner,
      date: string,
      _id:string
    }
  ],
  comments: [
    {
      owner: Owner,
      commentText:string
      date:string,
      replays:[
        {
          owner:Owner,
          replayText:string
          _id:string,
        }
      ]
      _id:string
    }
  ],
  date: string,
  _id:string
}
export interface Owner {
  _id: string,
  name: string,
  avatar: string
}
