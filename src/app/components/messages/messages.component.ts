import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
  constructor(private messagesService: MessagesService) {}
  
}
