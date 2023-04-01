import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Post } from '../_models';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUrl = '/api/posts';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true

  };

  constructor(
    private http: HttpClient) { }

  /** GET posts from the server */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
        tap(_ => this.log('fetched posts')),
        catchError(this.handleError<Post[]>('getposts', []))
      );
  }

  /** GET Post by id. Return `undefined` when id not found */
  getPostNo404<Data>(id: number): Observable<Post> {
    const url = `${this.postsUrl}/?id=${id}`;
    return this.http.get<Post[]>(url)
      .pipe(
        map(posts => posts[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} Post id=${id}`);
        }),
        catchError(this.handleError<Post>(`getPost id=${id}`))
      );
  }

  /** GET Post by id. Will 404 if id not found */
  getPost(id: number): Observable<Post> {
    const url = `${this.postsUrl}/${id}`;
    return this.http.get<Post>(url).pipe(
      tap(_ => this.log(`fetched Post id=${id}`)),
      catchError(this.handleError<Post>(`getPost id=${id}`))
    );
  }

  /* GET posts whose name contains search term */
  searchposts(term: string): Observable<Post[]> {
    if (!term.trim()) {
      // if not search term, return empty Post array.
      return of([]);
    }
    return this.http.get<Post[]>(`${this.postsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found posts matching "${term}"`) :
         this.log(`no posts matching "${term}"`)),
      catchError(this.handleError<Post[]>('searchposts', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Post to the server */
  addPost(formData: any): Observable<Post> {
    return this.http.post<Post>(`${this.postsUrl}`, formData,{withCredentials: true}).pipe(
      tap((newPost: Post) => this.log(`added Post w/ id=${newPost._id}`)),
      catchError(this.handleError<Post>('addPost'))
    );
  }

  /** DELETE: delete the Post from the server */
  deletePost(id: string): Observable<Post> {
    const url = `${this.postsUrl}/${id}`;

    return this.http.delete<Post>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Post id=${id}`)),
      catchError(this.handleError<Post>('deletePost'))
    );
  }

  /** PUT: update the Post on the server */
  updatePost(Post: Post): Observable<any> {
    return this.http.put(this.postsUrl, Post, this.httpOptions).pipe(
      tap(_ => this.log(`updated Post id=${Post._id}`)),
      catchError(this.handleError<any>('updatePost'))
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

  /** Log a PostService message with the MessageService */
  private log(message: string) {
    console.log(`PostService: ${message}`);
  }
}
