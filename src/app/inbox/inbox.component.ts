import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnChanges {
  @Input() chat: any;
  @Output() currentChat = new EventEmitter();
  private _me: string;
  unReadMessages: number = 0;

  constructor() {
    this._me = JSON.parse(localStorage.getItem('user') as string).user;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat']) {
      this.setNumberOfUnreadMessages();
    }
  }

  private setNumberOfUnreadMessages() {
    let counter: any = 0;
    console.log(this.chat.value);
    this.chat?.value?.forEach((message: any) => {
      if (message?.seen == false && message.reciever == this._me) {
        counter = counter + 1;
      }
    });
    this.unReadMessages = counter;
  }

  public onClick() {
    this.unReadMessages = 0;
    this.currentChat.emit(this.chat);
  }
}
