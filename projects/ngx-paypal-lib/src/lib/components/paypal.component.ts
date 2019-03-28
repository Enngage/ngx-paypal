import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
    Output,
    EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';

import {
    ICancelCallbackData,
    IClientAuthorizeCallbackData,
    ICreateOrderCallbackActions,
    IOnApproveCallbackActions,
    IOnApproveCallbackData,
    IQueryParam,
    IPayPalConfig,
    IOnShippingChangeData,
    IOnShippingChangeActions,
} from '../models/paypal-models';
import { ScriptService } from '../services/script.service';

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
    * Name of the global variable where paypal is stored
    */
    private readonly paypalWindowName = 'paypal';

    /**
     * Id of the element where PayPal button will be rendered
     */
    public payPalButtonContainerId?: string;

    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

    private payPalButtonContainerElem?: ElementRef;
    @ViewChild('payPalButtonContainer') set payPalButtonContainer(content: ElementRef) {
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
        private scriptService: ScriptService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.payPalButtonContainerId) {
            this.payPalButtonContainerId = this.generateElementId();
        }

        // init when config once its available
        const config = this.config;
        if (config && this.registerScript) {
            this.initPayPalScript(config, (payPal) => {
                // store reference to paypal global script
                this.payPal = payPal;
                this.doPayPalCheck();
            });
        }
    }

    ngOnDestroy(): void {
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

    private doPayPalCheck(): void {
        if (this.initializePayPal && this.config && this.payPal && this.payPalButtonContainerElem) {
            // make sure that id is also set
            if (this.payPalButtonContainerElem.nativeElement.id) {
                this.initializePayPal = false;
                this.initPayPal(this.config, this.payPal);
            }
        }
    }

    private getPayPalSdkUrl(config: IPayPalConfig): string {
        const params: IQueryParam[] = [
            {
                name: 'client-id',
                value: config.clientId
            }
        ];

        if (config.currency) {
            params.push({
                name: 'currency',
                value: config.currency
            });
        }

        if (config.advanced && config.advanced.updateOrderDetails) {
            params.push({
                name: 'commit',
                value: config.advanced.updateOrderDetails.commit ? 'true' : 'false'
            });
        }

        // add extra query params
        if (config.advanced && config.advanced.extraQueryParams) {
            params.push(...config.advanced.extraQueryParams);
        }

        return `https://www.paypal.com/sdk/js${this.getQueryString(params)}`;
    }

    private initPayPalScript(config: IPayPalConfig, initPayPal: (paypal: any) => void): void {
        this.scriptService.registerScript(this.getPayPalSdkUrl(config), this.paypalWindowName, (paypal) => {
            this.scriptLoaded.next(paypal);
            initPayPal(paypal);
        });
    }

    private getQueryString(queryParams: IQueryParam[]): string {
        let queryString = '';

        for (let i = 0; i < queryParams.length; i++) {
            const queryParam = queryParams[i];
            if (i === 0) {
                queryString += '?';
            } else {
                queryString += '&';
            }

            queryString += `${queryParam.name}=${queryParam.value}`;
        }

        return queryString;
    }

    private generateElementId(): string {
        return `ngx-captcha-id-${new Date().valueOf()}`;
    }

    private initPayPal(config: IPayPalConfig, paypal: any): void {
        // https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page
        paypal.Buttons({
            style: config.style,
            createOrder: (data: any, actions: ICreateOrderCallbackActions) => {
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
            },

            onApprove: (data: IOnApproveCallbackData, actions: IOnApproveCallbackActions) => {
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
                        onClientAuthorization(details);
                    });
                    return;
                }
            },

            onError: (error: any) => {
                if (config.onError) {
                    config.onError(error);
                }
            },

            onCancel: (data: ICancelCallbackData, actions: any) => {
                if (config.onCancel) {
                    config.onCancel(data, actions);
                }
            },
            onShippingChange: (data: IOnShippingChangeData, actions: IOnShippingChangeActions) => {
                if (config.onShippingChange) {
                    return config.onShippingChange(data, actions);
                }
            },
            onClick: () => {
                if (config.onClick) {
                    config.onClick();
                }
            },
        }).render(`#${this.payPalButtonContainerId}`);
    }
}


