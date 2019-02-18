import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import {
    ICancelCallbackData,
    IClientAuthorizeCallbackData,
    ICreateOrderCallbackActions,
    IOnApproveCallbackActions,
    IOnApproveCallbackData,
    PayPalConfig,
} from '../models/paypal-models';
import { ScriptService } from '../services';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'ngx-paypal',
    template: `
    <div #paypalButtonContainer [id]="paypalButtonContainerId"></div>
    `
})
export class NgxPaypalComponent implements OnChanges, OnDestroy {

    /**
     * Configuration for paypal.
     */
    @Input() config?: PayPalConfig;

    /**
    * Name of the global variable where paypal is stored
    */
    private readonly paypalWindowName = 'paypal';

    /**
     * Id of the element where PayPal button will be rendered
     */
    public paypalButtonContainerId?: string;

    private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private scriptService: ScriptService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.paypalButtonContainerId) {
            this.paypalButtonContainerId = this.generateElementId();
        }

        // init when config once its available
        const config = this.config;
        if (config) {
            this.initPayPalScript(config, (paypal) => this.initPayPal(config, paypal));
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private getPayPalSdkUrl(config: PayPalConfig): string {
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

        return `https://www.paypal.com/sdk/js${this.getQueryString(params)}`;
    }

    private initPayPalScript(config: PayPalConfig, initPayPal: (paypal: any) => void): void {
        this.scriptService.registerScript(this.getPayPalSdkUrl(config), this.paypalWindowName, (paypal) => {
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

    private initPayPal(config: PayPalConfig, paypal: any): void {
        // https://developer.paypal.com/docs/checkout/integrate/#2-add-the-paypal-script-to-your-web-page
        paypal.Buttons({
            style: config.style,

            createOrder: (data: any, actions: ICreateOrderCallbackActions) => {
                return actions.order.create(config.createOrder(data));
            },

            onApprove: (data: IOnApproveCallbackData, actions: IOnApproveCallbackActions) => {
                if (config.onApprove) {
                    config.onApprove(data, actions);
                }

                // capture on server
                if (config.authorizeOnServer) {
                    config.authorizeOnServer(data, actions);
                    return;
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
            onClick: () => {
                if (config.onClick) {
                    config.onClick();
                }
            },
        }).render(`#${this.paypalButtonContainerId}`);
    }
}

interface IQueryParam {
    name: string;
    value: string;
}

