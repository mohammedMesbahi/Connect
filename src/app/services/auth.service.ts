import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { User } from '../_models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user!: User;
  public loggedIn$!: BehaviorSubject<boolean>;
  constructor(private router: Router, private http: HttpClient) {
    this.loggedIn$ = new BehaviorSubject<boolean>(false);
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
    return this.http.post<User>(`${environment.apiUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      .pipe(
        map((user:User) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.user = user;
          this.loggedIn$.next(true);
          return user;
        })
      );
  }

  logOut() {
    return this.http
      .get(`${environment.apiUrl}/api/auth/signout`, { withCredentials: true })
      .pipe(
        map((message) => {
          // remove user from local storage to log user out
          localStorage.clear();
          // remove message from local storage after successful signout
          return message;
        })
      );
  }

  public isAuthenticated(): Observable<boolean | UrlTree> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/auth/isAuthenticated`, { withCredentials: true })
      .pipe(
        map((res: any) => {
          if (res.authenticated) {
            return true
          } else {
            return this.router.createUrlTree(['/login']);
          }
        })
      )
  }

}
