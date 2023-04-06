import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { catchError,map } from 'rxjs/operators';
import {Message, User,Notification, NotificationToSend } from '../_models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private socket!:Socket;
notificationsEmmiter: BehaviorSubject<Notification[]>;

  constructor(private messagesServiece:MessagesService,
    private http: HttpClient
    ) {
    this.socket = this.messagesServiece.socket;
    this.notificationsEmmiter = new BehaviorSubject([] as Notification[]);

  }
  /**
   * reaction event
   */
  public emitNotification(notification:NotificationToSend) { this.socket.emit('notification', notification); }
  public newNotification() {
    return this.socket.fromEvent('newNotification').pipe(
      map((data: any) => {
        return data
      }),
      catchError(this.handleError<Notification>('newNotification'))
    );
  }

  getNotificationsFromTheServer() {
    return this.http.get<Notification[]>(`/api/notifications/`, { withCredentials: true, })
  }

  saveNotificationsInLocalStorage(notifications: Notification[]) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.notificationsEmmiter.next(notifications);
  }

  getNotificationsFromLocalStorage():Notification[] {
    return JSON.parse(localStorage.getItem("notifications") as string);
  }

  addNewNotification(notification:Notification){
    let notifications = this.getNotificationsFromLocalStorage();
    if (notifications) {
      notifications.push(notification);
    }
    this.saveNotificationsInLocalStorage(notifications);
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

    /** Log a MessageService message with the MessageService */
    private log(message: string) {
      console.log(`MessagesService: ${message}`);
    }

}

