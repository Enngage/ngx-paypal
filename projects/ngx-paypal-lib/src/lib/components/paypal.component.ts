import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

import {
    ICancelCallbackData,
    IClientAuthorizeCallbackData,
    ICreateOrderCallbackActions,
    IInitCallbackData,
    IOnApproveCallbackActions,
    IOnApproveCallbackData,
    IOnClickCallbackActions,
    IOnInitCallbackActions,
    IOnShippingChangeActions,
    IOnShippingChangeData,
    IPayPalConfig,
    ICreateSubscriptionCallbackActions,
    ICreateSubscriptionCallbackData,
} from '../models/paypal-models';
import { PayPalScriptService } from '../services/paypal-script.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'ngx-paypal',
    template: `
    <div #payPalButtonContainer [id]="payPalButtonContainerId"></div>
    `
})
export class NgxPaypalComponent implements OnChanges, OnDestroy, AfterViewInit {

    /**
     * Configuration for paypal.
     */
    @Input() config?: IPayPalConfig;

    /**
     * If enabled, paypal SDK script will be loaded. Useful if you want to have multiple PayPal components on the same page
     * sharing base configuration. In such a case only a single component may register script.
     */
    @Input() registerScript: boolean = true;

    /**
     * Emitted when paypal script is loaded
     */
    @Output() scriptLoaded = new EventEmitter<any>();

    /**
     * Id of the element where PayPal button will be rendered
     */
    public payPalButtonContainerId?: string;

    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

    private payPalButtonContainerElem?: ElementRef;
    @ViewChild('payPalButtonContainer', { static: false }) set payPalButtonContainer(content: ElementRef) {
        this.payPalButtonContainerElem = content;
    }

    /**
     * Flag that indicates if paypal should be initialized (required for handling script load events and availability of DOM element)
     */
    private initializePayPal: boolean = true;

    /**
     * Reference to PayPal global API
     */
    private payPal: any;

    constructor(
        private paypalScriptService: PayPalScriptService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.payPalButtonContainerId) {
            this.payPalButtonContainerId = this.generateElementId();
        }

        // first time config setup
        const config = this.config;

        if (changes.config.isFirstChange()) {
            if (config && this.registerScript) {
                this.initPayPalScript(config, (payPal) => {
                    // store reference to paypal global script
                    this.payPal = payPal;
                    this.doPayPalCheck();
                });
            }
        }

        // changes to config
        if (!changes.config.isFirstChange()) {
            this.reinitialize(config);
        }
    }

    ngOnDestroy(): void {
        this.paypalScriptService.destroyPayPalScript();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit(): void {
        this.doPayPalCheck();
    }

    customInit(payPal: any): void {
        this.payPal = payPal;
        this.doPayPalCheck();
    }

    reinitialize(config: IPayPalConfig | undefined): void {
        this.config = config;
        this.payPal = undefined;
        this.paypalScriptService.destroyPayPalScript();
        this.payPalButtonContainerId = this.generateElementId();
        this.initializePayPal = true;

        if (this.payPalButtonContainerElem) {
            while (this.payPalButtonContainerElem.nativeElement.firstChild) {
                this.payPalButtonContainerElem.nativeElement.removeChild(this.payPalButtonContainerElem.nativeElement.firstChild);
            }
        }

        this.cdr.detectChanges();

        if (this.config) {
            if (!this.payPal) {
                this.initPayPalScript(this.config, (payPal) => {

                    // store reference to paypal global script
                    this.payPal = payPal;
                    this.doPayPalCheck();
                });
            } else {
                this.doPayPalCheck();
            }
        }
    }


    private doPayPalCheck(): void {
        if (this.initializePayPal && this.config && this.payPal && this.payPalButtonContainerElem) {
            // make sure that id is also set
            if (this.payPalButtonContainerElem.nativeElement.id) {
                this.initializePayPal = false;
                this.initPayPal(this.config, this.payPal);
            }
        }
    }

    private initPayPalScript(config: IPayPalConfig, initPayPal: (paypal: any) => void): void {
        this.paypalScriptService.registerPayPalScript({
            clientId: config.clientId,
            commit: config.advanced && config.advanced.commit ? config.advanced.commit : undefined,
            currency: config.currency,
            extraParams: config.advanced && config.advanced.extraQueryParams ? config.advanced.extraQueryParams : []
        }, (paypal) => {
            this.scriptLoaded.next(paypal);
            initPayPal(paypal);
        });
    }

    private generateElementId(): string {
        return `ngx-captcha-id-${new Date().valueOf()}`;
    }

    private initPayPal(config: IPayPalConfig, paypal: any): void {
        // Running outside angular zone prevents infinite ngDoCheck lifecycle calls
        this.ngZone.runOutsideAngular(() => {
            // https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page
            paypal.Buttons({
                style: config.style,
                createOrder: (data: any, actions: ICreateOrderCallbackActions) => {
                    return this.ngZone.run(() => {
                        if (config.createOrderOnClient && config.createOrderOnServer) {
                            throw Error(`Both 'createOrderOnClient' and 'createOrderOnServer' are defined.
                        Please choose one or the other.`);
                        }

                        if (!config.createOrderOnClient && !config.createOrderOnServer) {
                            throw Error(`Neither 'createOrderOnClient' or 'createOrderOnServer' are defined.
                        Please define one of these to create order.`);
                        }

                        if (config.createOrderOnClient) {
                            return actions.order.create(config.createOrderOnClient(data));
                        }

                        if (config.createOrderOnServer) {
                            return config.createOrderOnServer(data);
                        }

                        throw Error(`Invalid state for 'createOrder'.`);
                    });
                },

                onApprove: (data: IOnApproveCallbackData, actions: IOnApproveCallbackActions) => {
                    return this.ngZone.run(() => {
                        if (config.onApprove) {
                            config.onApprove(data, actions);
                        }

                        // capture on server
                        if (config.authorizeOnServer) {
                            return config.authorizeOnServer(data, actions);
                        }

                        // capture on client
                        const onClientAuthorization = config.onClientAuthorization;
                        if (onClientAuthorization) {
                            actions.order.capture().then((details: IClientAuthorizeCallbackData) => {
                                this.ngZone.run(() => {
                                    onClientAuthorization(details);
                                });
                            });
                            return;
                        }
                    });
                },

                onError: (error: any) => {
                    this.ngZone.run(() => {
                        if (config.onError) {
                            config.onError(error);
                        }
                    });
                },

                onCancel: (data: ICancelCallbackData, actions: any) => {
                    this.ngZone.run(() => {
                        if (config.onCancel) {
                            config.onCancel(data, actions);
                        }
                    });
                },
                onShippingChange: (data: IOnShippingChangeData, actions: IOnShippingChangeActions) => {
                    return this.ngZone.run(() => {
                        if (config.onShippingChange) {
                            return config.onShippingChange(data, actions);
                        }
                    });
                },
                onClick: (data: any, actions: IOnClickCallbackActions) => {
                    this.ngZone.run(() => {
                        if (config.onClick) {
                            config.onClick(data, actions);
                        }
                    });
                },
                onInit: (data: IInitCallbackData, actions: IOnInitCallbackActions) => {
                    this.ngZone.run(() => {
                        if (config.onInit) {
                            config.onInit(data, actions);
                        }
                    });
                },
                createSubscription: (data: ICreateSubscriptionCallbackData, actions: ICreateSubscriptionCallbackActions) => {
                    this.ngZone.run(() => {
                        if (config.createSubscription) {
                            config.createSubscription(data, actions);
                        }
                    });
                }
            }).render(`#${this.payPalButtonContainerId}`);
        });
    }
}


