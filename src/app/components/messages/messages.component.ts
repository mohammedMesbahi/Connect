import { Component, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {


  private _selectedUser = {
    userName:"user2",
    userId:"63ef9b422739b278209cbd9d",
    imgUrl:"https://i.pravatar.cc/34"

  };
  public get selectedUser() {
    return this._selectedUser;
  }
  public set selectedUser(value) {
    this._selectedUser = value;
  }


  private onConnection: Observable<any>;
  private onMessage: Observable<any>;
  private OnDisconnection: Observable<any>;
  private _chats = [];
  public get chats() {
    return this._chats;
  }
  public set chats(value) {
    this._chats = value;
  }
  constructor(private messagesService: MessagesService,private dataService:DataService) {
    this.onConnection = this.messagesService.onConnection();
    this.onMessage = this.messagesService.onMessage();
    // this.OnComment = this.messagesService.OnComment();
    // this.OnReplay = this.messagesService.OnReplay();
    // this.OnReaction = this.messagesService.OnReaction();
    // this.OnNewPost = this.messagesService.OnNewPost();
    this.OnDisconnection = this.messagesService.OnDisconnection();
    this.onConnection.subscribe({
      next: (data: any) => console.log(data),
    });

    this.onMessage.subscribe({
      next: (data: any) => console.log(data),
    });

    this.OnDisconnection.subscribe({
      next: (data: any) => console.log(data),
    });
  }

  ngOnInit(): void {
    // this.chats = this.dataService.getChats();

  }

  public sendMessage(message:string,reciever:string) {
    this.messagesService.emitMessage({
      reciever:reciever,
      content:message,
      userName:"mesbahi"
  });

  }
}
