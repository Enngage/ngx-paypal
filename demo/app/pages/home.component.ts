import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { ICreateOrderRequest, IPayPalConfig } from '../../../projects/ngx-paypal-lib/src/public_api';

declare var hljs: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnInit {
  public defaultPrice: string = '9.99';
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
        commit: 'true'
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
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
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

  @ViewChild('priceElem') priceElem?: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
    this.initConfig('9.99');
  }

  ngAfterViewInit(): void {
    this.prettify();
  }

  changePrice(): void {
    if (this.priceElem) {
      this.initConfig(this.priceElem.nativeElement.value);
    }
  }

  private initConfig(price: string): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: price,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: price
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
                  value: price,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
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
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        this.resetStatus();
      },
      onInit: (data, actions) => {
        console.log('onInit', data, actions);
      }
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
