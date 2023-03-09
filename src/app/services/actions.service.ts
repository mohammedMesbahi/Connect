import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private router: Router, private http: HttpClient) {

  }
  
}
