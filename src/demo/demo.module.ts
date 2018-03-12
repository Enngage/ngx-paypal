import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgxPayPalModule } from '../ngx-paypal';
import { AppComponent } from './app.component';
import { DemoRoutes } from './demo.routes';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    NgxPayPalModule.forRoot({
      clientId: 'id',
    }),
    DemoRoutes
  ],
  declarations: [
    AppComponent,
    MainComponent
  ],

  bootstrap: [AppComponent]
})
export class DemoModule { }
