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
import { MessagesService } from '../services/messages.service';
import { Conversation, Message } from '../_models';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit, OnDestroy ,OnChanges{

  @Input() conversation!: Conversation;
  @Output() currentconversation = new EventEmitter<Conversation>();

  _id!: string;
  unReadMessages: number = 0;

  constructor(private messagesService: MessagesService) {

  }
  ngOnInit(): void {
    this._id = this.messagesService._id;
    this.setNumberOfUnreadMessages();
  }
  ngOnDestroy(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversation']) {
      this.setNumberOfUnreadMessages();
    }
  }

  private setNumberOfUnreadMessages() {
    let counter: any = 0;
    this.conversation.messages.forEach((message: Message) => {
      if (message.sender != this._id && message.receivers.includes(this._id) && !message.seenBy.includes(this._id))
        counter = counter + 1;
    });
    this.unReadMessages = counter;
  }

  public onClick() {

    let data: { conversationId: string, messages: string[] } = { conversationId: "", messages: [] };
    for (let index = 0; index < this.conversation.messages.length; index++) {
      if (this.conversation.messages[index].receivers.includes(this._id) && !this.conversation.messages[index].seenBy.includes(this._id)) {
        this.conversation.messages[index].seenBy.push(this._id)
        data.messages.push(this.conversation.messages[index]._id)
      }
    }
    data.conversationId = this.conversation._id;
    if (data.messages.length) {
      this.messagesService.markAsSeenMessages(data);
      console.log("mark as seen messages");
    }
    this.unReadMessages = 0;
    this.currentconversation.emit(this.conversation);
  }
}
