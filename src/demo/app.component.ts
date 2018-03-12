import { Component } from '@angular/core';

@Component({
  selector: 'ngx-app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  public year = new Date().getFullYear();
}
