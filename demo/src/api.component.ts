import { AfterViewChecked, Component, OnInit } from '@angular/core';

import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from '../../src';

declare var PR: any;

@Component({
  templateUrl: './api.component.html',
})
export class ApiComponent implements OnInit, AfterViewChecked {

  public payPalConfig?: PayPalConfig;

  public readonly installCode = `npm install ngx-paypal --save`;

  public readonly htmlCode = `
  <ngx-paypal [config]="payPalConfig"></ngx-paypal>
  `;

  public readonly tsCode = `
  import { Component, OnInit } from '@angular/core';

  import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

  @Component({
    templateUrl: './main.component.html',
  })
  export class MainComponent implements OnInit {

    public payPalConfig?: PayPalConfig;

    ngOnInit(): void {
      this.initConfig();
    }

    private initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
        },
        button: {
          label: 'paypal',
        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete');
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: (err) => {
          console.log('OnError');
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
  `;

  constructor() {
  }

  ngOnInit(): void {
    this.initConfig();
  }

  ngAfterViewChecked(): void {
    this.prettify();
  }

  private initConfig(): void {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
      },
      button: {
        label: 'paypal',
      },
      onPaymentComplete: (data, actions) => {
        console.log('OnPaymentComplete');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: 9
        }
      }]
    });
  }

  private prettify(): void {
    if (window['PR']) {
      PR.prettyPrint();
    }
  }

}
