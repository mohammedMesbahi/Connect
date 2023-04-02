import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: {} | undefined = undefined;
  constructor(private router: Router, private http: HttpClient) {
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
          localStorage.removeItem('user');
          // remove message from local storage after successful signout
          localStorage.removeItem('chats');
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

  public isAuthenticated():Observable<boolean | UrlTree> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/auth/isAuthenticated`, { withCredentials: true })
    .pipe(
      map( (res:any) => {
        if(res.authenticated){
          return true
        } else {
          return this.router.createUrlTree(['/login']);
        }
      })
    )
  }
}
