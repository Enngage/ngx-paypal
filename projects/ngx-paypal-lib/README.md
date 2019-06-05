[![npm version](https://badge.fury.io/js/ngx-paypal.svg)](https://badge.fury.io/js/ngx-paypal)
[![Build Status](https://api.travis-ci.org/Enngage/ngx-paypal.svg?branch=master)](https://travis-ci.org/Enngage/ngx-paypal)
[![NPM](https://nodei.co/npm/ngx-paypal.png?mini=true)](https://nodei.co/npm/ngx-paypal/)

## Angular PayPal

PayPal integration for Angular. For live example and documentation visit [https://enngage.github.io/ngx-paypal/](https://enngage.github.io/ngx-paypal/)

 This Angular library is based on PayPal's [Javascript SDK](https://developer.paypal.com/docs/checkout/#try-the-buttons). It does not support each and every feature of the JavaScript SDK so feel free to submit issues or PRs.

 I strongly recommend checking out PayPal's docs linked above if you want to learn more about the flow of checkout process and meaning behind certain properties. There are ton of properties you can set within the `createOrder` method and good IDE will show you these properties so use that, I don't find it particulary useful to list all properties and their description here - PayPal docs is your friend.

## Installation

```javascript
npm install ngx-paypal --save
```

Import `NgxPayPalModule` in your module (i.e. `AppModule`) 

### Template

```typescript
import { NgxPayPalModule } from 'ngx-paypal';
```

```typescript
@NgModule({
  imports: [
    NgxPayPalModule,
    ...
  ],
})
```

### Html code

```html
<ngx-paypal [config]="payPalConfig"></ngx-paypal>
```

## Creating orders on client

```typescript
import {
    Component,
    OnInit
} from '@angular/core';
import {
    IPayPalConfig,
    ICreateOrderRequest 
} from 'ngx-paypal';

@Component({
    templateUrl: './your.component.html',
})
export class YourComponent implements OnInit {

    public payPalConfig ? : IPayPalConfig;

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrder: (data) => < ICreateOrderRequest > {
                intent: 'CAPTURE',
                purchase_units: [{
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
                    items: [{
                        name: 'Enterprise Subscription',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'EUR',
                            value: '9.99',
                        },
                    }]
                }]
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
        };
    }
}
```

## Creating orders on server

```typescript
import {
    Component,
    OnInit
} from '@angular/core';
import {
    IPayPalConfig,
    ICreateOrderRequest 
} from 'ngx-paypal';

@Component({
    templateUrl: './your.component.html',
})
export class YourComponent implements OnInit {

    public payPalConfig?: IPayPalConfig;

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        this.payPalConfig = {
            clientId: 'sb',
            // for creating orders (transactions) on server see
            // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
            createOrderOnServer: (data) => fetch('/my-server/create-paypal-transaction')
                .then((res) => res.json())
                .then((order) => data.orderID),
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
        };
    }
}
```

## Authorizing on server

To authorize on payment on server, provide `authorizeOnServer`. If you do so, client validation is not used and therefore the `onClientAuthorization` will not be called.

```typescript
import {
    Component,
    OnInit
} from '@angular/core';
import {
    IPayPalConfig,
    ICreateOrderRequest 
} from 'ngx-paypal';

@Component({
    templateUrl: './your.component.html',
})
export class YourComponent implements OnInit {

    public payPalConfig?: IPayPalConfig;

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        this.payPalConfig = {
            clientId: 'sb',
            // for creating orders (transactions) on server see
            // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
            createOrderOnServer: (data) => fetch('/my-server/create-paypal-transaction')
                .then((res) => res.json())
                .then((order) => data.orderID),
            authorizeOnServer: (approveData) => {
                fetch('/my-server/authorize-paypal-transaction', {
                    body: JSON.stringify({
                    orderID: approveData.orderID
                    })
                }).then((res) => {
                    return res.json();
                }).then((details) => {
                    alert('Authorization created for ' + details.payer_given_name);
                });
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
        };
    }
}
```

## Multiple ngx-paypal components on the same page

If you want to have multiple PayPal buttons on the same page, you can do so only if they share some basic properties (e.g. currency, commit flag..) because these are configured via URL query parameters when requesting PayPal's javascript SDK. PayPal does not allow registesting multiple SDKs on the same page. 

The key is to inject `PayPalScriptService`, register script manually and then call `customInit` with the PayPal API once your component is available. Note that if you use conditions (`*ngIf`) you will have to adjust the core accordingly because of the timings and call `customInit` once both PayPalApi has loaded and your component was initialized. 

```typescript
import {
    PayPalScriptService, IPayPalConfig
} from 'ngx-paypal';

export class YourComponent implements OnInit {

    public payPalConfig?: IPayPalConfig;

    @ViewChild('payPalElem1') paypalComponent1?:  NgxPaypalComponent;
    @ViewChild('payPalElem2') paypalComponent2?:  NgxPaypalComponent;

    constructor(
        private payPalScriptService: PayPalScriptService
    ) { }

    ngOnInit(): void {
        this.payPalConfig = {}; // your paypal config

        this.payPalScriptService.registerPayPalScript({
        clientId: 'sb',
        currency: 'EUR'
        }, (payPalApi) => {
            if (this.paypalComponent1) {
                this.paypalComponent1.customInit(payPalApi);
            }

            if (this.paypalComponent2) {
                this.paypalComponent2.customInit(payPalApi);
            }
        });
    }
}
```

```html
  <ngx-paypal #payPalElem1 [config]="payPalConfig" [registerScript]="false"></ngx-paypal>
  <ngx-paypal #payPalElem2 [config]="payPalConfig" [registerScript]="false"></ngx-paypal>
```


## Unit testing

Unit testing in Angular is possible, but a bit clunky because this component tries to dynamically include paypals's script if its not already loaded. You are not required to include in globally or manually which has a benefit of not loading until you actually use this component. This has a caveat though, since the load callback is executed outside of Angular's zone, performing unit tests might fail due to racing condition where Angular might fail the test before the script has a chance to load and initialize captcha.

A simple fix for this is wait certain amount of time so that everything has a chance to initialize. See example below:

```typescript
beforeEach(() => {
        fixture = TestBed.createComponent(YourComponent);
        component = fixture.componentInstance;
        setTimeout(function () {
            fixture.detectChanges();
        }, 2000);
});
```

## Breaking v5 release
Versions > 5 represent completely rewrite of the library and switch to latest PayPal JavaScript SDK. Its highly recommended to use this version. If you still wish to use previous version, check [v4 branch](https://github.com/Enngage/ngx-paypal/tree/v4) for previous documentation.

### Publishing lib

Under `projects\ngx-paypal-lib` run 

```
npm run publish-lib
```

### Publishing demo app

Under root, generate demo app with

```
npm run build-demo-gh-pages
npx ngh --dir=dist-demo
```

