import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { group } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private _myEmitter: BehaviorSubject<any>;
  public get myEmitter(): BehaviorSubject<any> {
    return this._myEmitter;
  }
  public set myEmitter(value: BehaviorSubject<any>) {
    this._myEmitter = value;
  }
  constructor(private socket: Socket, private http: HttpClient) {
    this._myEmitter = new BehaviorSubject(this.ChatsFromLocaStorage());
  }

  /**
   * onConnection event
   */
  public onConnection() {
    return this.socket.fromEvent('connection');
  }

  /**
   * message event
   */
  public emitMessage(message: any) {
    this.socket.emit('notification-message', message);
  }

  public onMessage() {
    return this.socket.fromEvent('notification-message').pipe(
      map((message) => {
        this.upDateChatsInLocalStorage(message);
        return message;
      })
    );
  }

  /**
   * comment event
   */
  public emitComment(comment: any) {
    this.socket.emit('notification-comment', comment);
  }
  public OnComment() {
    return this.socket.fromEvent('notification-comment');
  }

  /**
   * replay event
   */
  public emitReplay(replay: any) {
    this.socket.emit('notification-comment', replay);
  }
  public OnReplay() {
    return this.socket.fromEvent('notification-replay');
  }

  /**
   * reaction event
   */
  public emitReaction(reaction: any) {
    this.socket.emit('notification-reaction', reaction);
  }
  public OnReaction() {
    return this.socket.fromEvent('notification-reaction');
  }

  /**
   * new post event
   */
  public emitNewPost(post: any) {
    this.socket.emit('notification-new-post', post);
  }
  public OnNewPost() {
    return this.socket.fromEvent('notification-new-post');
  }

  /**
   * disconnection event
   */
  public emitDisconnection(disconnection: any) {
    this.socket.emit('notification-disconnection', disconnection);
  }
  public OnDisconnection() {
    return this.socket.fromEvent('disconnection');
  }

  /* *
    seenMessages event

  */
  public onSeenMessages() {
    return this.socket.fromEvent('seenMessages').pipe(
      map((seenMessages: any) => {
        let chats = this.ChatsFromLocaStorage();
        let oldArrayOfMessages: any[];
        for (const [key, messages] of chats) {
          if (
            (messages as any[]).findIndex(
              (message) => message._id == seenMessages[0]
            ) != -1
          ) {
            oldArrayOfMessages = chats.get(key);
            oldArrayOfMessages = oldArrayOfMessages.map((message) => {
              if ((seenMessages as any[]).includes(message._id)) {
                message.seen = true;
              }
            });
            chats.set(key, oldArrayOfMessages);
            this.saveChatsInLocalStorage(chats);
          }
        }
      })
    );
  }
  
  markAsSeenMessages(messages: { _id: any }[]) {
    this.socket.emit('markAsSeenMessages', messages);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  get Socket() {
    return this.socket;
  } /*

  new methods

  */

  /* getChats() {
    return new Observable((observer) => {
      observer.next(JSON.parse(localStorage.getItem('chats') as string));
      observer.complete();
    });
  } */

  /* clearStorege() {
    localStorage.removeItem('chats');
  } */

  // load chats from the server group theme and store theme in the local storage as "chats"
  loadChats() {
    return this.http
      .get(`${environment.apiUrl}/api/messages/allMessages`, {
        withCredentials: true,
      })
      .pipe(
        map((message: any) => {
          let userID = this.myId();
          let groups = message.reduce((accumulator: any, current: any) => {
            let key =
              current.sender != userID ? current.sender : current.reciever;
            if (!accumulator[key]) {
              accumulator[key] = [];
            }
            accumulator[key].push(current);
            return accumulator;
          }, {});
          this.saveChatsInLocalStorage(groups);
        })
      );
  }
  saveChatsInLocalStorage(chats: any) {
    localStorage.setItem('chats', JSON.stringify(chats));
    this._myEmitter.next(this.ChatsFromLocaStorage());
  }
  // a method to add the new messages to the chats stored in the localhost
  upDateChatsInLocalStorage(message: any) {
    let chatId =
      message.sender != this.myId() ? message.sender : message.reciever;

    let currentChats: any = this.ChatsFromLocaStorage();
    currentChats = new Map(Object.entries(currentChats));

    let currentChat: any = currentChats.get(chatId);
    currentChat.push(message);
    currentChats.set(chatId, currentChat);
    let newmap = Object.fromEntries(currentChats.entries());

    this.saveChatsInLocalStorage(newmap);
  }

  myId() {
    return JSON.parse(localStorage.getItem('user') as string).user;
  }
  ChatsFromLocaStorage() {
    return JSON.parse(localStorage.getItem('chats') as string);
  }
}
