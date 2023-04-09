import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';
import { Conversation, Message, Owner, User } from 'src/app/shared/_models';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit,OnDestroy {
  @ViewChild('messagesDiv') m: ElementRef | undefined;
  private onConnection!: Observable<any>;
  private onMessage!: Observable<any>;
  private OnDisconnection!: Observable<any>;
  me!: User;

  conversations!: Conversation[];
  conversationsEmmiter!: BehaviorSubject<Conversation[]>;
  ElevatedDiscussion!: Conversation;
  onSeenMessages!: Observable<any>;

  arrayOfSubscriptions!: Subscription[];

  constructor(
    private messagesService: MessagesService,
    private userService: UserService
  ) { }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {

    this.me = this.userService.myProfile();
    this.arrayOfSubscriptions = [];

    this.arrayOfSubscriptions.push(this.messagesService.conversationsEmmiter.subscribe({
      next:(conversations: Conversation[]) => { this.conversations = conversations },
      error:console.log
    }))
    this.arrayOfSubscriptions.push(this.messagesService.newSeenMessages().subscribe((data: any) => {
      if (this.ElevatedDiscussion && (data.conversationId == this.ElevatedDiscussion._id)) {
        data.messages.forEach((message: any) => {
          let messagIndex: number = -1;
          messagIndex = this.ElevatedDiscussion?.messages.findIndex(m => m._id === message) as number;
          if (messagIndex != -1) {
            this.ElevatedDiscussion?.messages[messagIndex].seenBy.push(data.seenBy);
          }
        })
      }
    }))
    this.arrayOfSubscriptions.push(this.messagesService.newMessage().subscribe((data: any) => {
      if (this.ElevatedDiscussion && (data.conversationId == this.ElevatedDiscussion._id)) {
        this.messagesService.markAsSeenMessages({conversationId:data.conversationId,messages:[data.message._id]})
        this.ElevatedDiscussion.messages.push(data.message)
        this.scrollToBottom();
      }
    }))
    this.arrayOfSubscriptions.push(this.messagesService.OnDisconnection().subscribe({
      next: (data) => console.log(data)
    }))
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

  public setUser(conversation: Conversation) {
    this.ElevatedDiscussion = conversation;
    this.scrollToBottom();
  }

  public sendMessage(conversationId: string, receivers: Owner[], content: string) {
    if (!content.length) {
      return
    }
    let r: string[] = [];
    receivers.forEach(p => {
      if (p._id != this.me._id) {
        r.push(p._id)
      }
    })

    this.messagesService.emitMessage({
      receivers: r,
      content: content.trim(),
      conversationId: conversationId
    });
  }

  seenByMe(seenBy: string[]): boolean {
    return seenBy.includes(this.me._id);
  }
}
