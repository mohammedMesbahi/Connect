import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'api/users';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };
  constructor(private http: HttpClient) { }
  /** GET users from the server */
  getusers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl,{withCredentials:true})
      .pipe(
        tap(_ => this.log('fetched users')),
        catchError(this.handleError<User[]>('getusers', []))
      );
  }

  /** GET User by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.usersUrl}/profile/${id}`;
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
  getUser(id:string): Observable<User> {
    const url = `${this.usersUrl}/profile/${id}`;
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
    return this.http.get<User[]>(`${this.usersUrl}?name=${term}`,{withCredentials:true}).pipe(
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

  myProfile():User{
    return JSON.parse(localStorage.getItem('user') as string)
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
