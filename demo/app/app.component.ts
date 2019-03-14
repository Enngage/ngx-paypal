import { AfterViewInit, Component, OnInit } from '@angular/core';

import { ICreateOrderRequest, IPayPalConfig } from '../../projects/ngx-paypal-lib/src/public_api';

declare var hljs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  public payPalConfig?: IPayPalConfig;

  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;
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

  public readonly initPaypalCode = `this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        updateOrderDetails: {
          commit: true
        }
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: () => {
        console.log('onClick');
      },
    };`;

  public readonly htmlCode = `<ngx-paypal [config]="payPalConfig"></ngx-paypal>`;

  public readonly usageCodeTs = `
  import { Component, OnInit } from '@angular/core';
  import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

  @Component({
    templateUrl: './your.component.html',
  })
  export class YourComponent implements OnInit {

    public payPalConfig?: IPayPalConfig;

    ngOnInit(): void {
      this.initConfig();
    }

    private initConfig(): void {
      ${this.initPaypalCode}
    }
  }
  `;

  constructor() { }

  ngOnInit(): void {
    this.initConfig();
  }

  ngAfterViewInit(): void {
    this.prettify();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        updateOrderDetails: {
          commit: true
        }
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: () => {
        console.log('onClick');
        this.resetStatus();
      },
    };
  }

  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }

  private prettify(): void {
    hljs.initHighlightingOnLoad();
  }
}
