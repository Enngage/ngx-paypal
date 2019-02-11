[![npm version](https://badge.fury.io/js/ngx-paypal.svg)](https://badge.fury.io/js/ngx-paypal)
[![Build Status](https://api.travis-ci.org/Enngage/ngx-paypal.svg?branch=master)](https://travis-ci.org/Enngage/ngx-paypal)
[![NPM](https://nodei.co/npm/ngx-paypal.png?mini=true)](https://nodei.co/npm/ngx-paypal/)

## Angular PayPal

PayPal integration for Angular 6+. For live example and documentation visit [https://enngage.github.io/ngx-paypal/](https://enngage.github.io/ngx-paypal/)

This library is based on [PayPal's checkout integration](https://developer.paypal.com/docs/checkout/integrate/#1-get-the-code). Please refer to this documentation for description of API options and their meaning.

## Supported versions

1. For Angular 6 use ngx-captcha on version `<= 3.x.y`
2. For Angular 7 use ngx-captcha on version `>= 4.0.0`

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
          sandbox: 'yourSandboxClientId',
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

