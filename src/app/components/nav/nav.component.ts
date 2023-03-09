import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  private _showNotifications = false;
  private _showSearch = false;
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
  @Output("changeView") EventChangeToSelectedView = new EventEmitter<string>();
  @Output("logoutEvent") EventlogOut = new EventEmitter<string>();
  changeViewTo(selectedView:string) {
    this.EventChangeToSelectedView.emit(selectedView);
  }
  logOut(){
    this.EventlogOut.emit();
  }
}
