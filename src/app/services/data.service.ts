import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private postUrl = "https://dummyjson.com/posts";
  constructor(private http:HttpClient) { }
  getPosts(){
    return this.http.get(this.postUrl).pipe(
      map((data:any) => data.posts)
    )
  }
  public getUsers(){
    return this.http.get("https://api.github.com/users/mosh-hamedani/followers")
  }
}
