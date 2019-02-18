[![npm version](https://badge.fury.io/js/ngx-paypal.svg)](https://badge.fury.io/js/ngx-paypal)
[![Build Status](https://api.travis-ci.org/Enngage/ngx-paypal.svg?branch=master)](https://travis-ci.org/Enngage/ngx-paypal)
[![NPM](https://nodei.co/npm/ngx-paypal.png?mini=true)](https://nodei.co/npm/ngx-paypal/)

## Angular PayPal

PayPal integration for Angular. For live example and documentation visit [https://enngage.github.io/ngx-paypal/](https://enngage.github.io/ngx-paypal/)

 This Angular library is based on PayPal's [Javascript SDK](https://developer.paypal.com/docs/checkout/#try-the-buttons). It does not support each and every feature of the JavaScript SDK so feel free to submit issues or PRs.

 I strongly recommend checking out PayPal's docs linked above if you want to learn more about the flow of checkout process and meaning behind certain properties.

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

## TS code

Create `PayPalConfig` model and pass it to the `ngx-paypal` component via `config` input property.


```typescript
import {
    Component,
    OnInit
} from '@angular/core';
import {
    PayPalConfig
} from 'ngx-paypal';

@Component({
    templateUrl: './your.component.html',
})
export class MainComponent implements OnInit {

    public payPalConfig ? : PayPalConfig;

    ngOnInit(): void {
        this.initPaypal();
    }

    private initConfig(): void {
        this.payPalConfig = new PayPalConfig({
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
        });
    }
}
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

