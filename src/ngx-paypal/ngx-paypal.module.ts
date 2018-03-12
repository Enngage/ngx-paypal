import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxPaypalComponent } from './components/paypal-component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    NgxPaypalComponent,
  ],
  exports: [
    NgxPaypalComponent,
  ]
})
export class NgxPayPalModule {
}


