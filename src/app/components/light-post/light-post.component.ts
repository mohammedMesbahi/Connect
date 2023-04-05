import { Component, Input, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post, Reaction } from 'src/app/_models';
@Component({
  selector: 'app-light-post',
  templateUrl: './light-post.component.html',
  styleUrls: ['./light-post.component.css']
})
export class LightPostComponent implements OnInit {
  @Input('post') post!: Post;

  _id = this.postsService.myId();
  showComments !:boolean;
  didILiked!: boolean;
  numberOflikes!: number;
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
    this.postsService.toggleLike(this.post).subscribe({
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
    if (text.trim().length) {
      this.postsService.addComment(this.post,text.trim()).subscribe({
        next:(data) => {
          this.post.comments.push(data.comment);
          this.showComments=true;
        }
      });
    }

  }
}

