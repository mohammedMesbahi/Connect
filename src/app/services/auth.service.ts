import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Conversation, User } from '../_models';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /* onConnection!: Subscription;
  OnDisconnection!: Subscription;
  onMessage!: Subscription;
  conversations!: Conversation[];
  conversationsEmmiter!: Subscription;
  ElevatedDiscussion: Conversation | undefined = undefined;
  onSeenMessages!: Subscription;
  me!: User; */

  private user: {} | undefined = undefined;
  constructor(private router: Router, private http: HttpClient, private messagesService: MessagesService) {
    this.user = JSON.stringify(localStorage.getItem('user'));
  }

  register(formData: any) {
    return this.http
      .post(`${environment.apiUrl}/api/auth/signup`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(
        `${environment.apiUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.messagesService.connect();

          /* this.onConnection = this.messagesService.onConnection().subscribe();
          this.OnDisconnection = this.messagesService.OnDisconnection().subscribe();
          this.onMessage = this.messagesService.onMessage().subscribe();
          this.onSeenMessages = this.messagesService.onSeenMessages().subscribe();
          this.conversationsEmmiter = this.messagesService.conversationsEmmiter.subscribe();

          this.onConnection.unsubscribe();
          this.OnDisconnection.unsubscribe();
          this.onMessage.unsubscribe();
          this.onSeenMessages.unsubscribe();
          this.conversationsEmmiter.unsubscribe(); */

          return true;
        })
      );
  }

  logOut() {
    return this.http
      .get(`${environment.apiUrl}/api/auth/signout`, { withCredentials: true })
      .pipe(
        map((message) => {
          // remove user from local storage to log user out
          localStorage.clear();
          // remove message from local storage after successful signout
          return message;
        })
      );
  }

  get User() {
    return this.user;
  }

  isLoggedIn() {
    if (localStorage.getItem('user')) {
      return true;
    }
    return false;
  }

  public isAuthenticated(): Observable<boolean | UrlTree> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/auth/isAuthenticated`, { withCredentials: true })
      .pipe(
        map((res: any) => {
          if (res.authenticated) {
            return true
          } else {
            return this.router.createUrlTree(['/login']);
          }
        })
      )
  }
}
