[![npm version](https://badge.fury.io/js/ngx-paypal.svg)](https://badge.fury.io/js/ngx-paypal)
[![Build Status](https://api.travis-ci.org/Enngage/ngx-paypal.svg?branch=master)](https://travis-ci.org/Enngage/ngx-paypal)
[![NPM](https://nodei.co/npm/ngx-paypal.png?mini=true)](https://nodei.co/npm/ngx-paypal/)

## Angular PayPal

PayPal integration for Angular 6+. For live example and documentation visit [https://enngage.github.io/ngx-paypal/](https://enngage.github.io/ngx-paypal/)

This library is based on [https://developer.paypal.com/docs/checkout/integrate/#1-get-the-code](PayPal's checkout integration). Please refer to this documentation for description of API options and their meaning.

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
  import { Component, OnInit } from '@angular/core';
  import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

  @Component({
    templateUrl: './your.component.html',
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
          sandbox: 'yourSandboxKey'
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
```

