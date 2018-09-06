import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  PayPalConfig,
  PayPalIntegrationType,
  PayPalEnvironment
} from '../../projects/ngx-paypal-lib/src/public_api';

declare var hljs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  public payPalConfig?: PayPalConfig;

  public readonly npmCode = `npm install ngx-paypal --save`;

  public readonly moduleInstallation = `
  import { NgxPayPalModule } from 'ngx-paypal';

  @NgModule({
    imports: [
      NgxPayPalModule,
      ...
    ],
  })
  `;

  public readonly htmlCode = `<ngx-paypal [config]="payPalConfig"></ngx-paypal>`;

  public readonly usageCodeTs = `
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
          sandbox: 'yourSandboxClientId',
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
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

  constructor() {}

  ngOnInit(): void {
    this.initConfig();
  }

  ngAfterViewInit(): void {
    this.prettify();
  }

  private initConfig(): void {
    this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST,
      PayPalEnvironment.Sandbox,
      {
        commit: true,
        client: {
          sandbox:
            'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete');
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: err => {
          console.log('OnError');
        },
        onClick: () => {
          console.log('onClick');
        },
        transactions: [
          {
            amount: {
              currency: 'USD',
              total: 9
            }
          }
        ]
      }
    );
  }

  private prettify(): void {
    hljs.initHighlightingOnLoad();
  }
}
