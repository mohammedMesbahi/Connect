import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'api/users';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };
  constructor(private http: HttpClient,) { }
  /** GET users from the server */
  getusers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(_ => this.log('fetched users')),
        catchError(this.handleError<User[]>('getusers', []))
      );
  }

  /** GET User by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} User id=${id}`);
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET User by id. Will 404 if id not found */
  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched User id=${id}`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /* GET users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty User array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found users matching "${term}"`) :
        this.log(`no users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchusers', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new User to the server */
  addUser(User: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, User, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added User w/ id=${newUser._id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the User from the server */
  deleteUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted User id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the User on the server */
  updateUser(User: User): Observable<any> {
    return this.http.put(this.usersUrl, User, this.httpOptions).pipe(
      tap(_ => this.log(`updated User id=${User._id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    console.log(`UserService: ${message}`);
  }
}
export interface Post {
  _id: string
  owner: Owner,
  caption: string
  media?: string
  reactions: Reaction[],
  comments: Comment[],
  date: string,
}
export interface Owner {
  _id: string,
  name: string,
  avatar: string
}
export interface User {
  _id: string,
  name: string,
  email:string,
  avatar: string,
  password?:string,
  posts?:Post[],
  conversations?:Conversation[],
  following?:Owner[],
  followers?:Owner[]

}
export interface Conversation{
  _id:string,
  participents:Owner[]
  messages:Message[],
  date:string
}
export interface Message{
  _id:string,
  sender:Owner,
  recievers:string[],
  content:string,
  seenBy:string[],
  createdAt?:string,
  updateAt?:string
}
export interface Reaction {
  _id: string
  owner: Owner,
  date: string,
}
export interface Comment{
  _id: string
  owner: Owner,
  commentText: string
  date: string,
  replays: Replay[]
}
export interface Replay{
  _id: string,
  owner: Owner,
  replayText: string
  date:string
}