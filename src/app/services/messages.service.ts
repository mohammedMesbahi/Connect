import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Conversation, Message, User } from '../_models';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  private nameSpacesUrl = '/messages_notifications';  // URL to socket
  public newMessage!: BehaviorSubject<string>;
  public conversationsEmmiter: BehaviorSubject<Conversation[]>;
  arrayOfSubscriptions!: Subscription[];

  constructor(public socket: Socket,

    private http: HttpClient) {
    this.arrayOfSubscriptions = []
    this.conversationsEmmiter = new BehaviorSubject(this.getConversationsFromLocalStorage());
    this.newMessage = new BehaviorSubject('');

  }

  connect() {
    this.socket.connect();
    this.arrayOfSubscriptions.push(this.getConversations().subscribe())
    this.arrayOfSubscriptions.push(
      this.socket.fromEvent('newMessage')
        .pipe(
          map((data: any) => {
            console.log("new message");
            if (data.message.sender != this._id()) {
              this.newMessage.next('')
            }
            this.upDateConversationInLocalStorage(data.conversationId, data.message)
            this.log(`added Message w/ id=${data.message._id} to conversation${data.conversationId} i am in the connect methode`)
          }))
        .subscribe())

    this.arrayOfSubscriptions.push(
      this.socket.fromEvent<Conversation>('newConversation')
        .pipe(
          map((conversation: Conversation) => {
            this.newMessage.next('')
            this.addNewConversationToLocalStorage(conversation);
            this.log(`added conversation${conversation._id} i am in the connect methode`)
          }))
        .subscribe())

  }

  addNewConversationToLocalStorage(conversation: Conversation) {
    let conversations: Conversation[] | null = this.getConversationsFromLocalStorage();
    if (conversations) {
      conversations.push(conversation);
      localStorage.setItem('conversations', JSON.stringify(conversations))
      this.conversationsEmmiter.next(conversations)
      console.log("updated conversations in the localstorage");

    }
  }

  /**
   * onConnection event
   */
  public onConnection(): Observable<string[]> { return this.socket.fromEvent('connection'); }

  /**
   * message event
   */
  public emitMessage(data: any) { this.socket.emit('message', data); }
  public onMessage() {
    return this.socket.fromEvent('newMessage').pipe(
      map((data: any) => {
        this.log(`added Message "onMessageFunction" `)
        return data
      })
    );
  }

  /**
   * comment event
   */
  public emitComment(comment: any) { this.socket.emit('notification-comment', comment) }
  public OnComment() { return this.socket.fromEvent('notification-comment') }

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
  public onSeenMessages() {
    return this.socket.fromEvent('newSeenMessages').pipe(map((data: any) => {
      console.log('new seen messages');
      let conversations: Conversation[] = JSON.parse(localStorage.getItem('conversations') as string);
      console.log(conversations.length);
      let conversationIndex = -1;
      if (conversations) {
        conversationIndex = conversations?.findIndex(conversation => {
          conversation._id == data.conversationId
        })
        if (!(conversationIndex == -1)) {
          console.log('if2');

          data.messages.forEach((message: any) => {
            let messagIndex: number = -1;
            messagIndex = conversations[conversationIndex].messages.findIndex(m => m._id === message);
            if (!(messagIndex == -1)) {
              conversations[conversationIndex].messages[messagIndex].seenBy.push(data.seenBy);
            }

          })
        }

      }
      localStorage.setItem('conversations', JSON.stringify(conversations))
      this.conversationsEmmiter.next(conversations)
      return data;
    }))
  }
  public markAsSeenMessages(data: any) { this.socket.emit('markAsSeenMessages', data) }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe())
  }


  getConversations() {
    return this.http
      .get<Conversation[]>(`/api/messages/conversations`, {
        withCredentials: true,
      })
      .pipe(
        map((conversations: Conversation[]) => {
          console.log("fetched conversation from the server");
          localStorage.setItem('conversations', JSON.stringify(conversations));
          this.conversationsEmmiter.next(conversations);
          return conversations;
        })
      );
  }

  // a method to add the new messages to the chats stored in the localhost
  upDateConversationInLocalStorage(conversationId: string, message: Message) {
    let conversations: Conversation[] = this.getConversationsFromLocalStorage();
    if (conversations) {
      let index: number = conversations.findIndex(conversation => {
        // console.log(`(conversation._id : ${conversation._id}) - (conversation._id : ${conversationId}) = ${conversation._id == conversationId}`);
        return conversation._id == conversationId
      })
      if (index != -1) {
        conversations[index].messages.push(message);
        localStorage.setItem('conversations', JSON.stringify(conversations))
        this.conversationsEmmiter.next(conversations)
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
    return this.getConversationsFromLocalStorage()?.find((convesation) => {
      convesation._id === conversationId
    })
  }

  saveChatsInLocalStorage(chats: any) {
    localStorage.setItem('chats', JSON.stringify(chats));
    this.conversationsEmmiter.next(this.getConversationsFromLocalStorage());
  }

  _id() { return JSON.parse(localStorage.getItem('user') as string)._id }

  getConversationsFromLocalStorage(): Conversation[] {
    if (localStorage.getItem("conversations")) {
      return JSON.parse(localStorage.getItem("conversations") as string);
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
