import { Component, Input, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post, Reaction } from 'src/app/_models';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input('post') post!: Post;

  _id = this.postsService.myId();
  showComments = false;
  didILiked: boolean = false;
  numberOflikes:number = 0;
  constructor(private postsService: PostService) { }
  ngOnInit(): void {
    this.didILiked = this.IslikedByMe();
    this.numberOflikes = this.post.reactions.length;
  }

  IslikedByMe(): boolean {
    let r = this.post.reactions.findIndex((r => r.owner._id == this._id));
    return r != -1 ? true : false
  }

  toggleLike() {
    this.didILiked = !this.didILiked;
    this.postsService.toggleLike(this.post._id).subscribe({
      next: (data: { liked: boolean, reaction: Reaction }) => {
        if (data.liked) {
          this.post.reactions.push(data.reaction);
        } else {
          let reactionIndex = this.post.reactions.findIndex(r => r.owner._id = data.reaction.owner._id)
          if (reactionIndex != -1) {
            this.post.reactions.splice(reactionIndex, 1);
          }
        }
      }
    });
  }
  postComment(text:string){
    this.postsService.addComment();

  }
}

