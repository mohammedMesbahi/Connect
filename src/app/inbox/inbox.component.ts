import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
export class InboxComponent implements OnChanges {

  @Input() conversation!: Conversation;
  @Output() currentconversation = new EventEmitter();

  _id: string;
  unReadMessages: number = 0;

  constructor(public messagesService:MessagesService) {
    this._id = messagesService._id();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversation']) {
      this.setNumberOfUnreadMessages();
    }
  }

  private setNumberOfUnreadMessages() {
    let counter: any = 0;
    this.conversation?.messages.forEach((message: Message) => {
      if (message.receivers.includes(this._id) && !message.seenBy.includes(this._id)) {
        counter = counter + 1;
      }
    });
    this.unReadMessages = counter;
  }

  public onClick() {
    this.unReadMessages = 0;
    this.currentconversation.emit(this.conversation);
    let unSeenMessages = (this.conversation.messages).filter(
      (message: Message) => {
        return (message.receivers.includes(this._id) && !message.seenBy.includes(this._id));
      }
    )
    if (unSeenMessages.length) {
      let data: { conversationId: string, messages: string[] } = { conversationId: "", messages: [] };
      this.conversation.messages.forEach((message: Message) => data.messages.push(message._id));
      data.conversationId = this.conversation._id;
      this.messagesService.markAsSeenMessages(data);
    }
  }
}
