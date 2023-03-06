import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @Output("changeView") selectedView = new EventEmitter<string>();
  changeViewTo(selectedView:string) {
    this.selectedView.emit(selectedView);
  }

}
