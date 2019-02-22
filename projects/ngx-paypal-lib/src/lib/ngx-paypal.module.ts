import { NgModule } from '@angular/core';

import { NgxPaypalComponent } from './components/paypal-component';
import { ScriptService } from './services';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
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


