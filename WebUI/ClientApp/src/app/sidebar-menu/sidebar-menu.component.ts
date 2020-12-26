import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.css']
})
/** sidebar-menu component*/
export class SidebarMenuComponent {
  public navActive: string;
 
  constructor(private _appComponent: AppComponent) {
    this.navActive = _appComponent.navActive;
    console.log(this.navActive);
  }
   
}
