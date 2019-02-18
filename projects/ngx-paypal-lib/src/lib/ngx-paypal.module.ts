import { NgModule } from '@angular/core';

import { NgxPaypalComponent } from './components/paypal-component';
import { ScriptService } from './services';

@NgModule({
  imports: [
  ],
  declarations: [
    NgxPaypalComponent,
  ],
  exports: [
    NgxPaypalComponent,
  ],
  providers: [
    ScriptService
  ]
})
export class NgxPayPalModule {
}


