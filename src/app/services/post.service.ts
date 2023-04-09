import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Post, Reaction, Comment, NotificationToSend, User, Conversation } from '../shared/_models';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  postsUrl = '/api/posts';  // URL to web api
  me!: User;

  public postsEmmiter: BehaviorSubject<Post[]>;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true

  };

  constructor(
    private http: HttpClient, private notificationService: NotificationService) {
    this.postsEmmiter = new BehaviorSubject([] as Post[]);
    this.me = JSON.parse(localStorage.getItem('user') as string);
  }

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


  public getPostsById(id: string):Post[] {
    return this.getPostsFromLocalStorage().filter(p => p.owner._id == id)
  }

  getPostsOfAUserFromLocalStorage(id: string):Post[] {
    return this.getPostsFromLocalStorage().filter(p => p.owner._id == id)
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
    return this.http.post<Post>(`${this.postsUrl}`, formData, { withCredentials: true }).pipe(
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

  /** PUT: add or rmove like  */
  toggleLike(post: Post): Observable<{ liked: boolean, reaction: Reaction }> {
    return this.http.put<{ liked: boolean, reaction: Reaction }>("/api/posts/toggleLike", { postId: post._id }, this.httpOptions)
    .pipe(
      map((data: { liked: boolean, reaction: Reaction }) => {
        this.updateReactionsOfAPost(post._id, data);
        if (data.liked) {
          let notificationToSend: NotificationToSend = {
            notifier: this.myId(),
            recipients: [post.owner._id],
            notificationContent: `liked one of your posts`,
            postId: post._id,
            type:'reaction',
            body:data.reaction
          }

          this.notificationService.emitNotification(notificationToSend)
        }
        return data;
      }),
      catchError(this.handleError<any>('updatePost'))
    );
  }

  updateReactionsOfAPost(postId: string, data: { liked: boolean, reaction: Reaction }) {
    let posts = this.getPostsFromLocalStorage();
    let index = posts.findIndex(p => p._id == postId);
    if (index != -1) {
      if (data.liked) {
        posts[index].reactions.push(data.reaction);
      } else {
        let reactionIndex: number = posts[index].reactions.findIndex(r => r.owner._id = data.reaction.owner._id);
        if (reactionIndex != -1) {
          posts[index].reactions.splice(reactionIndex, 1);
        }
      }
    }
    this.savePostsInLocalStorage(posts);
  }
  /** PUT : add comment */
  addComment(post: Post, commentText: string): Observable<{ postId: string, comment: Comment }> {
    return this.http.put<{ postId: string, comment: Comment }>("/api/posts/comment", { postId: post._id, commentText: commentText }, this.httpOptions).pipe(
      map((data: { postId: string, comment: Comment }) => {
        this.updateCommentsOfAPost(data);
        let notificationToSend: NotificationToSend = {
          notifier: this.myId(),
          recipients: [post.owner._id],
          notificationContent: `commented on one of your posts`,
          postId: post._id,
          type:'comment',
          body:data.comment
        }

        this.notificationService.emitNotification(notificationToSend)
        return data;
      }),
      catchError(this.handleError<any>('updatePost'))
    );
  }

  updateCommentsOfAPost(data: { postId: string, comment: Comment }) {
    let posts = this.getPostsFromLocalStorage();
    let index = posts.findIndex(p => p._id == data.postId);
    if (index != -1) {
      posts[index].comments.push(data.comment);
    }
    this.savePostsInLocalStorage(posts);
  }

  savePostsInLocalStorage(posts: Post[]) {
    localStorage.setItem('posts', JSON.stringify(posts));
    this.postsEmmiter.next(posts);
  }

  getPostsFromLocalStorage(): Post[] {
    return JSON.parse(localStorage.getItem("posts") as string);
    /* if (localStorage.getItem("posts")) {
    } else
      return [] */
  }
  myId(): string {
    return JSON.parse(localStorage.getItem('user') as string)._id;
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
