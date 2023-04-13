import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Post } from 'src/app/shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  postsUrl = '/api/posts';  // URL to web api
  constructor(private http: HttpClient) { }
  /** GET posts from the server */
  getPostsFromTheServer() {
    return this.http.get<Post[]>(this.postsUrl, { withCredentials: true })
      .pipe(
        map((posts: Post[]) => {
          // localStorage.setItem('posts', JSON.stringify(posts));
          // this.postsEmmiter.next(posts);
          return posts
        }),
        catchError(this.handleError<Post[]>('getposts', []))
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
