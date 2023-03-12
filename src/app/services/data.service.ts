import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getChats() {
    if (!localStorage.getItem('chats')) {
      this.http
        .get(`${environment.apiUrl}/api/messages/allMessages`, {
          withCredentials: true,
        })
        .pipe(
          map((array: any) => {
            let { user } = JSON.parse(localStorage.getItem('user') as string);
            let groups = array.reduce((accumulator: any, current: any) => {
              let key =
                current.sender != user ? current.sender : current.reciever;
              if (!accumulator[key]) {
                accumulator[key] = [];
              }
              accumulator[key].push(current);
              return accumulator;
            }, {});

            localStorage.setItem('chats', JSON.stringify(groups));
            return groups;
          })
        );
    }
    const myObservable = new Observable((observer) => {
      // Here, you can define the logic that will produce the values for the observable
      observer.next(JSON.parse(localStorage.getItem('chats') as string));
      observer.complete();
    });
    return myObservable;
  }
  private postUrl = 'https://dummyjson.com/posts';

  constructor(private http: HttpClient) {}
  getPosts() {
    return this.http.get(this.postUrl).pipe(map((data: any) => data.posts));
  }
  public getUsers() {
    return this.http.get(
      'https://api.github.com/users/mosh-hamedani/followers'
    );
  }
}
