import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PaypalComponent } from './components/paypal-component';
import { PayPalConfig } from './models/paypal-models';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    PaypalComponent,
  ],
  exports: [
    PaypalComponent,
  ]
})
export class NgxPayPalModule {

  static forRoot(config: PayPalConfig): ModuleWithProviders {
    return {
      ngModule: NgxPayPalModule,
      providers: [
        { provide: PayPalConfig, useValue: config }
      ]
    };
  }
}


