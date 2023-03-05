import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: {} | undefined = undefined;
  constructor(private router: Router, private http: HttpClient) {
    this.user = JSON.stringify(localStorage.getItem('user'));
  }

  register(user: any) {
    return this.http.post(`${environment.apiUrl}/api/auth/signup`, user, { withCredentials: true })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }));;
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }));
  }

  get User() {
    return this.user
  }
  isLoggedIn() {
    if (localStorage.getItem('user')) {
      return true
    } 
    return false
  }
}
