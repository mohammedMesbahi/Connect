import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { Conversation, Message, Owner, User } from 'src/app/_models';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit,OnDestroy {
  @ViewChild('messagesDiv') m: ElementRef | undefined;

  onConnection!: Observable<any>;
  OnDisconnection!: Observable<any>;
  onMessage!: Observable<any>;
  conversations!: Conversation[];
  conversationsEmmiter!: BehaviorSubject<Conversation[]>;
  ElevatedDiscussion: Conversation | undefined = undefined;
  onSeenMessages!: Observable<any>;
  me!: User;

  arrayOfSubscriptions!: Subscription[];

  constructor(
    private messagesService: MessagesService, private userService: UserService
  ) {

  }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
  ngOnInit(): void {

    this.me = this.userService.myProfile();

    this.onConnection = this.messagesService.onConnection();
    this.OnDisconnection = this.messagesService.OnDisconnection();
    this.onMessage = this.messagesService.onMessage();
    this.onSeenMessages = this.messagesService.onSeenMessages();
    this.conversationsEmmiter = this.messagesService.conversationsEmmiter;

    this.arrayOfSubscriptions = []
    // this.OnComment = this.messagesService.OnComment();
    // this.OnReplay = this.messagesService.OnReplay();
    // this.OnReaction = this.messagesService.OnReaction();
    // this.OnNewPost = this.messagesService.OnNewPost();
    this.arrayOfSubscriptions.push(
      this.conversationsEmmiter.subscribe({
        next: (conversations: Conversation[]) => {
          this.conversations = conversations;
        },
      }),
      this.onSeenMessages.subscribe(({
        next: (data: any) => {
          if (this.ElevatedDiscussion && (data.conversationId == this.ElevatedDiscussion._id)) {
            data.messages.forEach((message: any) => {
              let messagIndex: number = -1;
              messagIndex = this.ElevatedDiscussion?.messages.findIndex(m => m._id === message) as number;
              if (messagIndex != -1) {
                this.ElevatedDiscussion?.messages[messagIndex].seenBy.push(data.seenBy);
              }
            })
          }
        },
      })),
      this.onMessage.subscribe({
        next: (data: any) => {
          if (this.ElevatedDiscussion && (data.conversationId == this.ElevatedDiscussion._id)) {
            this.ElevatedDiscussion.messages.push(data.message)
            this.scrollToBottom();
          }
        },
      }),
      this.onConnection.subscribe({
        next: (data) => console.log(data)
      }),
      this.OnDisconnection.subscribe({
        next: (data) => console.log(data)
      })
    )
  }


  // function to scroll to the bottom of the div

  public scrollToBottom() {
    setTimeout(() => {
      if (this.m) {
        this.m.nativeElement.scrollTop = this.m.nativeElement.scrollHeight;
      }
    });
  }


  trackMessage(index: any, message: Message) {
    return message ? message._id : undefined;
  }

  public setUser(conversation: any) {
    this.ElevatedDiscussion = conversation;

    // chat.numberOfUnreadMessages = this.numberOfUnreadMessages(chat.value);
    let unSeenMessages = (conversation.messages).filter(
      (message: Message) => {
        return (message.receivers.includes(this.me._id) && !message.seenBy.includes(this.me._id));
      }
    );
    if (unSeenMessages.length) {
      let data: { conversationId: string, messages: string[] } = { conversationId: "", messages: [] };
      conversation.messages.forEach((message: Message) => data.messages.push(message._id));
      data.conversationId = conversation._id;
      this.messagesService.markAsSeenMessages(data);
    }
    this.scrollToBottom();
  }


  public sendMessage(conversationId: string, receivers: Owner[], content: string) {
    if (!content.length)
      return
    let r: string[] = [];
    receivers.forEach(p => r.push(p._id));
    this.messagesService.emitMessage({
      receivers: r,
      content: content.trim(),
      conversationId: conversationId
    });
  }

  public numberOfUnreadMessages(array: any) {
    let counter: any = 0;
    array.forEach((message: any) => {
      if (message?.seen == false && message?.reciever == this.me._id) {
        counter = counter + 1;
      }
    });
    return counter;
  }

  seenByMe(seenBy: string[]): boolean {
    return seenBy.includes(this.me._id);
  }
}
