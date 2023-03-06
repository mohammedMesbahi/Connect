import { Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  private _view:string = "home";
  get view(){
    return this._view
  }
  set view(data: string) {
    this._view = data;
  }
}
