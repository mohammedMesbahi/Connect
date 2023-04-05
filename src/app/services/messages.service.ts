import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Conversation, Message, User } from '../_models';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  public _id!: string
  private conversationsEmmiter: BehaviorSubject<Conversation[]>;

  constructor(private socket: Socket, private http: HttpClient) {
    this.conversationsEmmiter = new BehaviorSubject([] as Conversation[]);
    this._id = JSON.parse(localStorage.getItem('user') as string)._id;
  }

  disconnectTheSocket() { this.socket.disconnect() }
  connectTheSocket(){ this.socket.connect() }

  /**
   * onConnection event
   */
  public newConnectionEvent() { return this.socket.fromEvent('connection'); }

  /**
   * message event
   */
  public emitMessage(data: any) { this.socket.emit('message', data); }
  public newMessage() {return this.socket.fromEvent('newMessage')}

  /**
   * comment event
   */
  public emitComment(comment: any) { this.socket.emit('notification-comment', comment) }
  public newComment() { return this.socket.fromEvent('notification-comment') }

  /**
   * replay event
   */
  public emitReplay(replay: any) { this.socket.emit('notification-comment', replay) }
  public OnReplay() { return this.socket.fromEvent('notification-replay') }

  /**
   * reaction event
   */
  public emitReaction(reaction: any) { this.socket.emit('notification-reaction', reaction) }
  public OnReaction() { return this.socket.fromEvent('notification-reaction') }

  /**
   * disconnection event
   */
  public emitDisconnection(disconnection: any) { this.socket.emit('notification-disconnection', disconnection) }
  public OnDisconnection() { return this.socket.fromEvent('disconnection') }

  /* *
    seenMessages event
  */
  public markAsSeenMessages(data: any) { this.socket.emit('markAsSeenMessages', data) }
  public newSeenMessages() {
    return this.socket.fromEvent('newSeenMessages').pipe(map((data: any) => {
      let conversations: Conversation[] = this.getConversationsFromLocalStorage();
      let conversationIndex = conversations.findIndex(conversation => { conversation._id === data.conversationId });
      if (!(conversationIndex == -1)) {

        data.messages.forEach((message: any) => {
          let messagIndex = conversations[conversationIndex].messages.findIndex(m => m._id === message);
          if (!(messagIndex == -1)) {
            conversations[conversationIndex].messages[messagIndex].seenBy.push(data.seenBy);
          }
        })
      }
      this.saveConversationsInLocalStorage(conversations);
      return data;
    }))
  }

  getConversationsFromTheServer() {
    return this.http.get<Conversation[]>(`/api/messages/conversations`, {withCredentials: true,})
  }

  addNewMessageToConversation(conversationId: string, message: Message) {
    let conversations: Conversation[] | null = this.getConversationsFromLocalStorage();
    let conversationIndex = conversations.findIndex(conversation => conversation._id == conversationId)
    if (!(conversationIndex == -1)) {
      conversations[conversationIndex].messages.push(message);
    }
    this.saveConversationsInLocalStorage(conversations);
  }

  getConversationFromLocalStorage(conversationId: string) {
    return this.getConversationsFromLocalStorage()?.find((convesation) => {
      convesation._id === conversationId
    })
  }

  saveConversationsInLocalStorage(conversations: Conversation[]) {
    localStorage.setItem('conversations', JSON.stringify(conversations));
    this.conversationsEmmiter.next(conversations);
  }

  getConversationsFromLocalStorage(): Conversation[] {
    return JSON.parse(localStorage.getItem("onversations") as string);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a MessageService message with the MessageService */
  private log(message: string) {
    console.log(`MessagesService: ${message}`);
  }
}
