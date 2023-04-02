import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {



  private postUrl = "";

  constructor(private http: HttpClient,private messagesService:MessagesService) {}
  getPosts() {
    return this.http.get(`/api/posts`,{ withCredentials: true }).pipe(map((data: any) => data));
  }
  public getUsers() {
    return this.http.get(
      'https://api.github.com/users/mosh-hamedani/followers'
    );
  }
  myId() {
    return JSON.parse(localStorage.getItem('user') as string);
  }
  clearLocalStorege(){
    localStorage.removeItem("chats")
    localStorage.removeItem('user')
  }
  /* loadChats(){
    return this.messagesService.loadChats();
  } */

}
