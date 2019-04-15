import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxPayPalModule } from '../../projects/ngx-paypal-lib/src/public_api';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home.component';
import { TestComponent } from './pages/test.component';
import { AppRoutesModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    NgxPayPalModule,
    AppRoutesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
