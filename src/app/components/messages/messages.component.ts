import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('messagesDiv') messagesDiv!: ElementRef;

  // function to scroll to the bottom of the div
  public scrollToBottom() {
      this.messagesDiv.nativeElement.scrollTop =this.messagesDiv.nativeElement.scrollHeight;
  }
  private _me = JSON.parse(localStorage.getItem('user') as string).user;
  public get me() {
    return this._me;
  }
  public set me(value) {
    this._me = value;
  }
  private _selectedUser: any | undefined = undefined;
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
  trackMessage(index: any, message: any) {
    return message ? message._id : undefined;
  }

  private onConnection: Observable<any>;
  private onMessage: Observable<any>;
  private OnDisconnection: Observable<any>;
  private _chats = new Map();
  private _myEmitter: BehaviorSubject<any>;
  public get chats() {
    return this._chats;
  }
  public set chats(value) {
    this._chats = value;
  }
  public setUser(value: any) {
    this.selectedUser = value;
    
  }
  constructor(
    private messagesService: MessagesService,
    private dataService: DataService
  ) {
    this.onConnection = this.messagesService.onConnection();
    this.onMessage = this.messagesService.onMessage();
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
      next: (data: any) => console.log(data),
    });

    this.onMessage.subscribe({
      next: (message: any) => {
        let tmp  = new Map(Object.entries(this.selectedUser));
        let newArray:any = tmp.get("value");
        newArray.push(message);
        tmp.set("value", newArray);
        this.selectedUser = Object.fromEntries(tmp.entries());
      },
    });

    this.OnDisconnection.subscribe({
      next: (data: any) => console.log(data),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    /* this.dataService.getChats().subscribe({
      next:(chats:any) => {
        this.chats = chats;
        console.log(chats);

      }
    }); */
  }

  public sendMessage(message: string, reciever: string) {
    this.messagesService.emitMessage({
      reciever: reciever,
      content: message,
      userName: 'mesbahi',
    });
  }

  ngAfterViewInit(): void {
    // Scroll to the bottom of the div after it has been rendered
    this.scrollToBottom();
  }
}
