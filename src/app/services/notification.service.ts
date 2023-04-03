import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { catchError,map } from 'rxjs/operators';
import { Conversation, Message, User,Notification, NotificationToSend } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private _socket!:Socket;
  constructor(private messagesServiece:MessagesService) {
    this._socket = messagesServiece.socket
  }
  /**
   * reaction event
   */
  public emitNotification(notification:NotificationToSend) { this._socket.emit('notification', notification); }
  public onNotification() {
    return this._socket.fromEvent('newNotification').pipe(
      map((data: any) => {
        this.upDateNotificationsInLocalStorage()
        this.log(`added notification w/ id=${data.notification._id} to notifications`)
        return data
      }),
      catchError(this.handleError<Notification>('newNotification'))
    );
  }
  upDateNotificationsInLocalStorage() {
    throw new Error('Method not implemented.');
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

