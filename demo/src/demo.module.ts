import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgxPayPalModule } from '../../src';
import { ApiComponent } from './api.component';
import { AppComponent } from './app.component';
import { DemoRoutes } from './demo.routes';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    NgxPayPalModule,
    DemoRoutes
  ],
  declarations: [
    AppComponent,
    MainComponent,
    ApiComponent
  ],

  bootstrap: [AppComponent]
})
export class DemoModule { }
