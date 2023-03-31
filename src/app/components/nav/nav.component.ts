import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/messages.service';
import {MatDialog} from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit,OnDestroy{
  private _showNotifications = false;
  private _showSearch = false;
  // private onMessage: Observable<any>;
  private _newmessagesCounter = 0;
  // private messagesObseravable:Subscription;

  @Output("changeView") EventChangeToSelectedView = new EventEmitter<string>();
  @Output("logoutEvent") EventlogOut = new EventEmitter<string>();
  @Output("createEvent") EventCreate = new EventEmitter<string>();
  selectedView = "";
  public get newmessagesCounter() {
    return this._newmessagesCounter;
  }
  public set newmessagesCounter(value) {
    this._newmessagesCounter = value;
  }
  constructor(private messagesService: MessagesService,
    public matDialog:MatDialog) {
    /* this.onMessage = this.messagesService.onMessage();
    this.messagesObseravable = this.onMessage.subscribe(() => {
      if (this.selectedView != "messages"){
        this._newmessagesCounter++;
      }

    }) */
  }
  ngOnDestroy(): void {
    this.messagesService.disconnect();
    // this.messagesObseravable.unsubscribe();
  }
  ngOnInit(): void {

  }
  get showNotifications(){
    return this._showNotifications;
  }
  get showSearch(){
    return this._showSearch;
  }
  public toggleNotifications(){
    this._showNotifications = !this._showNotifications
  }
  public toggleSearch(){
    this._showSearch = !this._showSearch;
  }


  changeViewTo(selectedView:string) {
    this.selectedView  = selectedView;
    if (selectedView == "messages") {
        this.newmessagesCounter=0
    }
    this.EventChangeToSelectedView.emit(selectedView);
  }
  logOut(){
    this.EventlogOut.emit();
  }

  openCreatePostDialog() {
    this.EventCreate.emit("");
}
}
