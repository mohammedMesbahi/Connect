import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MessagesService } from './services/messages.service';
import { Conversation } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Project-frontEnd';
  constructor(private authService: AuthService, private messagesService: MessagesService) {

  }
  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.messagesService.getConversationsFromTheServer().subscribe((conversations: Conversation[]) => {
          this.messagesService.saveConversationsInLocalStorage(conversations);
        })
        this.messagesService.connectTheSocket();
        this.messagesService.newMessage().subscribe((data:any) => {
          this.messagesService.addNewMessageToConversation(data.conversationId,data.message);
        })
      }
    })

  }
  /* this.activatedRout.fragment.subscribe((post:any) => {
    this.jumpTo(post)
  }) */
  /* jumpTo(post:any){
    document.getElementById(post)?.scrollIntoView({behavior:'smooth'})
  } */
}
