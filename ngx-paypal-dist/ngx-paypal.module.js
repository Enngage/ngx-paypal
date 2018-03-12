"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var paypal_component_1 = require("./components/paypal-component");
var paypal_models_1 = require("./models/paypal-models");
var NgxPayPalModule = /** @class */ (function () {
    function NgxPayPalModule() {
    }
    NgxPayPalModule_1 = NgxPayPalModule;
    NgxPayPalModule.forRoot = function (config) {
        return {
            ngModule: NgxPayPalModule_1,
            providers: [
                { provide: paypal_models_1.PayPalConfig, useValue: config }
            ]
        };
    };
    NgxPayPalModule = NgxPayPalModule_1 = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule
            ],
            declarations: [
                paypal_component_1.PaypalComponent,
            ],
            exports: [
                paypal_component_1.PaypalComponent,
            ]
        })
    ], NgxPayPalModule);
    return NgxPayPalModule;
    var NgxPayPalModule_1;
}());
exports.NgxPayPalModule = NgxPayPalModule;
