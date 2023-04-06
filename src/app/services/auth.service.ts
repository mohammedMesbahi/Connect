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
  loggedIn$:BehaviorSubject<boolean>;
  redirectUrl!: string;

  constructor(private router: Router, private http: HttpClient) {
    this.redirectUrl = 'login';
    this.loggedIn$ = new BehaviorSubject(false);
    this.isAuthenticated().subscribe(
      (respanse:any)=>{
        this.loggedIn$.next(respanse.authenticated);
      }
    )
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
    return this.http.post(`${environment.apiUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      .pipe(
        map((user:any) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.user = user;
          this.loggedIn$?.next(true);
          return user;
        })
      )
  }

  logOut() {
    return this.http
      .get(`${environment.apiUrl}/api/auth/signout`, { withCredentials: true })
      .pipe(
        map((message) => {
          localStorage.clear();
          this.loggedIn$.next(false);
          return message;
        })
      );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/auth/isAuthenticated`, { withCredentials: true })

  }

}
