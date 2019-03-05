import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxPaypalComponent } from './components/paypal.component';
import { ScriptService } from './services/script.service';

@NgModule({
  imports: [
    CommonModule
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


