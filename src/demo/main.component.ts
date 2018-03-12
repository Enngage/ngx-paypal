import { Component, OnInit } from '@angular/core';

import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from '../ngx-paypal';

@Component({
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {

  public payPalConfig?: PayPalConfig;

  public readonly installCode = `npm install ngx-paypal`;

  constructor() {
  }

  ngOnInit(): void {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
      },
      onPaymentComplete: (data, actions) => {
        console.log('OnPaymentComplete');
        console.log(data);
        console.log(actions);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel:');
        console.log(data);
        console.log(actions);
      },
      onError: (err) => {
        console.log('OnError:');
        console.log(err);
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: 9
        }
      }]
    });
  }

}
