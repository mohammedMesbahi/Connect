import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Conversation, Message, User } from '../_models';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private nameSpacesUrl = '/messages_notifications';  // URL to web api

  private _conversationsEmmiter: BehaviorSubject<Conversation[]>;

  public get conversationsEmmiter(): BehaviorSubject<Conversation[]> {
    return this._conversationsEmmiter;
  }


  constructor(private _socket: Socket, private http: HttpClient) {
    this._conversationsEmmiter = new BehaviorSubject(this.getConversationsFromLocalStorage());
  }
  get socket() { return this._socket }

  /**
   * onConnection event
   */
  public onConnection() { return this._socket.fromEvent('connection'); }

  /**
   * message event
   */
  public emitMessage(data: any) { this._socket.emit('message', data); }
  public onMessage() {
    return this._socket.fromEvent('newMessage').pipe(
      map((data: any) => {
        this.upDateConversationInLocalStorage(data.conversationId, data.message)
        this.log(`added Message w/ id=${data.message._id} to conversation${data.conversationId} `)
        return data
      }),
      catchError(this.handleError<Message>('addMessage'))
    );
  }

  /**
   * comment event
   */
  public emitComment(comment: any) { this._socket.emit('notification-comment', comment) }
  public OnComment() { return this._socket.fromEvent('notification-comment') }

  /**
   * replay event
   */
  public emitReplay(replay: any) { this._socket.emit('notification-comment', replay) }
  public OnReplay() { return this._socket.fromEvent('notification-replay') }

  /**
   * reaction event
   */
  public emitReaction(reaction: any) { this._socket.emit('notification-reaction', reaction) }
  public OnReaction() { return this._socket.fromEvent('notification-reaction') }

  /**
   * disconnection event
   */
  public emitDisconnection(disconnection: any) { this._socket.emit('notification-disconnection', disconnection) }
  public OnDisconnection() { return this._socket.fromEvent('disconnection') }

  /* *
    seenMessages event
  */
  public onSeenMessages() {
    return this._socket.fromEvent('newSeenMessages').pipe(map((data: any) => {
      let user: User | null = JSON.parse(localStorage.getItem('user') as string);
      if (user) {
        let index: number = user.conversations?.findIndex(conversation => {
          conversation._id === data.conversationId
        })
        if (index && index != -1) {
          data.messages.forEach((message: any) => {
            let messagIndex: number = -1;
            messagIndex = user?.conversations.at(index)?.messages.findIndex(m => m._id === message) as number;
            if (messagIndex != -1) {
              user?.conversations?.at(index)?.messages.at(messagIndex)?.seenBy.push(data.seenBy);
            }

          })
          localStorage.setItem('user',
            JSON.stringify(user)
          )
          this._conversationsEmmiter.next(user.conversations)
        }

      }
      return data;
    }))
  }
  public markAsSeenMessages(data: any) { this._socket.emit('markAsSeenMessages', data) }

  disconnect() { if (this._socket) { this._socket.disconnect() } }


  getConversations() {
    return this.http
      .get<Conversation[]>(`/api/messages/conversations`, {
        withCredentials: true,
      })
      .pipe(
        map((conversations: Conversation[]) => {
          localStorage.setItem('conversations', JSON.stringify(conversations));
          this.conversationsEmmiter.next(conversations);
        })
      );
  }

  // a method to add the new messages to the chats stored in the localhost
  upDateConversationInLocalStorage(conversationId: string, message: Message) {
    let conversations: Conversation[] | null = JSON.parse(localStorage.getItem('conversations') as string);
    if (conversations) {
      let index: number = conversations.findIndex(conversation => {
        // console.log(`(conversation._id : ${conversation._id}) - (conversation._id : ${conversationId}) = ${conversation._id == conversationId}`);
        return conversation._id == conversationId
      })
      if (index != -1) {
        conversations.at(index)?.messages.push(message);
        localStorage.setItem('conversations',JSON.stringify(conversations))
        this._conversationsEmmiter.next(conversations)
        console.log("updated conversations in the localstorage");
      }

    }

    /* let conversation:Conversation |undefined= this.getConversationFromLocalStorage(conversationId);
    if (conversation) {
      conversation.messages.push(message)
    } */

    /* let chatId =
      message.sender != this.myId() ? message.sender : message.reciever;

    let currentChats: any = this.conversations();
    currentChats = new Map(Object.entries(currentChats));

    let currentChat: any = currentChats.get(chatId);
    currentChat.push(message);
    currentChats.set(chatId, currentChat);
    let newmap = Object.fromEntries(currentChats.entries()); */


  }

  getConversationFromLocalStorage(conversationId: string) {
    return this.getConversationsFromLocalStorage().find((convesation) => {
      convesation._id === conversationId
    })
  }

  saveChatsInLocalStorage(chats: any) {
    localStorage.setItem('chats', JSON.stringify(chats));
    this._conversationsEmmiter.next(this.getConversationsFromLocalStorage());
  }

  _id() { return JSON.parse(localStorage.getItem('user') as string)._id }

  getConversationsFromLocalStorage(): Conversation[] {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user") as string).conversations;
    } else {
      return [];
    }
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
