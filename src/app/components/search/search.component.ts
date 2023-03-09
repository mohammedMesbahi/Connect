import { Component, OnInit } from '@angular/core';
import { ActionsService } from 'src/app/services/actions.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  private _users: any | undefined = undefined;
  private _u: any | undefined = undefined;
  public isLoading: boolean = false;
  userToFind: string = '';

  public get users(): any {
    return this._users;
  }
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    // Perform any initialization tasks here.
  }
  /**
   * searchForUser
   */
  public searchForUser(value: string) {
    this._users=undefined;
    if (value.trim().length) {
      this.isLoading=true
      this.dataService.getUsers().subscribe({
        next: (data: any) => {
          data = (data as Array<any>).filter((user: any) =>
            (user.login as string).startsWith(value)
          );
          this._u = data;
          this.isLoading = false;
          console.log(data);
        },
        complete:()=> this._users=this._u
      });
    }
  }
}
