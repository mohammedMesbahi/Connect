import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private socket: Socket) {}

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
    return this.socket.fromEvent('notification-message');
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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  get Socket(){
    return this.socket;
  }
}
