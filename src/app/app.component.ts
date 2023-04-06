import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MessagesService } from './services/messages.service';
import { Conversation } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'Project-frontEnd';
  arrayOfSubscriptions: Subscription[];
  constructor(private authService: AuthService, private messagesService: MessagesService) {
    this.arrayOfSubscriptions = [];
  }
  ngOnDestroy(): void {
    console.log("ondestroy AppComponent");
    this.arrayOfSubscriptions.forEach(s =>s.unsubscribe())
  }
  ngOnInit(): void {
    this.authService.loggedIn$?.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        // pull conversations form the server
        // connect the socket
        // subscribe for new messages and update the localstorage
        // subscribe for new-seen-messages and update the localstorage
        this.arrayOfSubscriptions.push(this.messagesService.getConversationsFromTheServer().subscribe((conversations: Conversation[]) => {
          if (conversations == null) {
            conversations = []
          }
          this.messagesService.saveConversationsInLocalStorage(conversations);
        }))
        this.messagesService.connectTheSocket();
        this.arrayOfSubscriptions.push(this.messagesService.newMessage().subscribe((data: any) => {
          this.messagesService.addNewMessageToConversation(data.conversationId, data.message);
        }))
        this.arrayOfSubscriptions.push(this.messagesService.newConversation().subscribe((con: any) => {
          this.messagesService.addNewConversation(con);
        }))
        this.arrayOfSubscriptions.push(this.messagesService.newSeenMessages().subscribe((data: any) => {
          let conversations: Conversation[] = this.messagesService.getConversationsFromLocalStorage();
          if (conversations) {
            let conversationIndex = conversations.findIndex(conversation => { conversation._id === data.conversationId });
            if (!(conversationIndex == -1)) {

              data.messages.forEach((message: any) => {
                let messagIndex = conversations[conversationIndex].messages.findIndex(m => m._id === message);
                if (!(messagIndex == -1)) {
                  conversations[conversationIndex].messages[messagIndex].seenBy.push(data.seenBy);
                }
              })
            }
          }
          this.messagesService.saveConversationsInLocalStorage(conversations);
        }))
      } else {
        // disconnect the socket
        // unsubscribe from new messages
        // unsubscribe from new-seen-messages
        this.messagesService.disconnectTheSocket();
        this.arrayOfSubscriptions.forEach(s => s.unsubscribe());
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
