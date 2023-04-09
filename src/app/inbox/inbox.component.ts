import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from '../services/messages.service';
import { Conversation, Data, Message, Owner } from '../shared/_models';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit, OnDestroy {

  @Input() conversation!: Conversation;
  @Output() currentconversation = new EventEmitter<Conversation>();

  _id!: string;
  unReadMessages!: number;
  data!: Data;
  arrayOfSubscriptions!: Subscription[];
  friend!:Owner;
  constructor(private messagesService: MessagesService) {

  }
  ngOnInit(): void {
    this.arrayOfSubscriptions = []
    this._id = this.messagesService._id;
    this.friend = this.conversation.participents.filter( p => p._id != this._id)[0];
    this.unReadMessages = 0;
    this.data = {
      conversationId: "",
      messages: []
    }
    this.data.conversationId = this.conversation?._id;
    this.setNumberOfUnreadMessages();
    this.arrayOfSubscriptions.push(
      this.messagesService.newSeenMessages().subscribe({
        next: (data: any) => {
          data.messages.forEach((message: any) => {
            let messagIndex = this.conversation.messages.findIndex(m => m._id === message);
            if (!(messagIndex == -1)) {
              this.conversation.messages[messagIndex].seenBy.push(data.seenBy);
            }
          })
        }
      })
    )

  }
  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
  }
  /* ngOnChanges(changes: SimpleChanges) {
    if (changes['conversation']) {
      let counter: any = 0;
      changes['conversation'].currentValue.messages.forEach((message: Message) => {
        if (message.sender != this._id && message.receivers.includes(this._id) && !message.seenBy.includes(this._id))
          counter = counter + 1;
      });
      this.unReadMessages = counter;
    }
  } */

  private setNumberOfUnreadMessages() {
    this.conversation?.messages.forEach((message: Message) => {
      if (message.sender != this._id && message.receivers.includes(this._id) && !message.seenBy.includes(this._id))
        this.unReadMessages = this.unReadMessages + 1;
    });
  }

  public onClick() {

    for (let index = 0; index < this.conversation.messages.length; index++) {
      if (this.conversation.messages[index].receivers.includes(this._id) && !this.conversation.messages[index].seenBy.includes(this._id)) {
        this.conversation.messages[index].seenBy.push(this._id)
        this.data.messages.push(this.conversation.messages[index]._id)
      }
    }
    if (this.data.messages.length) {
      this.messagesService.markAsSeenMessages(this.data);
      console.log("mark as seen messages");
    }
    this.unReadMessages = 0;
    this.currentconversation.emit(this.conversation);
  }
}

