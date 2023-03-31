import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable ,Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
  @ViewChild('messagesDiv') m: ElementRef | undefined;
  private onConnection: Observable<any>;
  private onMessage: Observable<any>;
  private OnDisconnection: Observable<any>;
  private _chats = new Map();
  private _myEmitter: BehaviorSubject<any>;

  private _me = JSON.parse(localStorage.getItem('user') as string).user;
  private _selectedUser: any | undefined = undefined;
  onSeenMessages: Subscription;


  constructor(
    private messagesService: MessagesService,
    private dataService: DataService
  ) {
    this.onConnection = this.messagesService.onConnection();
    this.onMessage = this.messagesService.onMessage();
    this.onSeenMessages = this.messagesService.onSeenMessages().subscribe();

    // this.OnComment = this.messagesService.OnComment();
    // this.OnReplay = this.messagesService.OnReplay();
    // this.OnReaction = this.messagesService.OnReaction();
    // this.OnNewPost = this.messagesService.OnNewPost();

    this.OnDisconnection = this.messagesService.OnDisconnection();
    this._myEmitter = this.messagesService.myEmitter;

    this._myEmitter.subscribe({
      next: (chats) => {
        this._chats = chats;
      },
    });

    this.onConnection.subscribe({

    });

    this.onMessage.subscribe({
      next: (message: any) => {
        if (this.selectedUser && (message.sender == this.selectedUser.userId || message.reciever == this.selectedUser.userId)) {
          let tmp = new Map(Object.entries(this.selectedUser));
          let newArray: any = tmp.get('value');
          newArray.push(message);
          tmp.set('value', newArray);
          this.selectedUser = Object.fromEntries(tmp.entries());
          this.scrollToBottom();
        }
      },
    });

    this.OnDisconnection.subscribe({

    });
  }


  // function to scroll to the bottom of the div

  public scrollToBottom() {
    setTimeout(() => {
      if (this.m) {
        this.m.nativeElement.scrollTop = this.m.nativeElement.scrollHeight;
      }
    });
  }

  public get me() {
    return this._me;
  }
  public set me(value) {
    this._me = value;
  }

  /* private _selectedUser = {
    userName:"user2",
    userId:"63ef9b422739b278209cbd9d",
    imgUrl:"https://i.pravatar.cc/34"

  }; */

  public get selectedUser() {
    return this._selectedUser;
  }
  public set selectedUser(value) {
    this._selectedUser = value;
  }

  public get chats() {
    return this._chats;
  }
  public set chats(value) {
    this._chats = value;
  }

  /*   trackMessage(index: any, message: any) {
    return message ? message._id : undefined;
  } */

  public setUser(chat: any) {
    this.selectedUser = chat;

    // chat.numberOfUnreadMessages = this.numberOfUnreadMessages(chat.value);
    let unSeenMessages = (chat.value as any[]).filter(
      (message: any) => {
        return (!message.seen && message.reciever === this._me);
      }
    );
    if (unSeenMessages.length) {
      let messages = (chat.value as any[])
        .map((message: any, index) => {
          return {
            _id: message._id,
          };
        });
      this.messagesService.markAsSeenMessages(messages);
    }
    this.scrollToBottom();
  }

  public sendMessage(message: string, reciever: string) {
    this.messagesService.emitMessage({
      reciever: reciever,
      content: message,
      userName: 'mesbahi',
    });
  }

  public numberOfUnreadMessages(array: any) {
    let counter: any = 0;
    array.forEach((message: any) => {
      if (message?.seen == false && message?.reciever == this._me ) {
        counter = counter + 1;
      }
    });
    return counter;
  }
}
