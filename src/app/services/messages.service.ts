import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private socket: Socket) { }
  /**
   * onConnection event
   */
  public onConnection() {
    return this.socket.fromEvent('connection');
  }

  /**
   * message event
   */
  public emitMessage(message:any){
    return this.socket.emit('notification-message', message);
  }
  public onMessage(){
    return this.socket.fromEvent('notification-message');
  }


  /**
   * comment event
   */
  public emitComment(comment:any) {
    return this.socket.emit('notification-comment',comment);
  }
  public OnComment() {
    return this.socket.fromEvent('notification-comment');
  }

  /**
   * replay event
   */
  public emitReplay(replay:any) {
    return this.socket.emit('notification-comment',replay);
  }
  public OnReplay() {
    return this.socket.fromEvent('notification-replay');
  }

  /**
   * reaction event
   */
  public emitReaction(reaction:any) {
    return this.socket.emit('notification-reaction',reaction);
  }
  public OnReaction() {
    return this.socket.fromEvent('notification-reaction');
  }

  /**
   * new post event
   */
  public emitNewPost(post:any) {
    return this.socket.emit('notification-new-post',post);
  }
  public OnNewPost() {
    return this.socket.fromEvent('notification-new-post');
  }

  /**
   * disconnection event
   */
  public emitDisconnection(disconnection:any) {
    return this.socket.emit('notification-disconnection',disconnection);
  }
  public OnDisconnection() {
    return this.socket.fromEvent('notification-disconnection');
  }
}
