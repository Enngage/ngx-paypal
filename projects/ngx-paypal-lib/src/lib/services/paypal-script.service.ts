import { Injectable } from '@angular/core';

import { IPayPalUrlConfig, IQueryParam } from '../models/paypal-models';
import { ScriptService } from './script.service';

@Injectable()
export class PayPalScriptService {

    private readonly paypalWindowName = 'paypal';


    constructor(
        protected scriptService: ScriptService,
    ) {
    }

    registerPayPalScript(config: IPayPalUrlConfig, onReady: (payPalApi: any) => void): void {
        this.scriptService.registerScript(this.getUrlForConfig(config), this.paypalWindowName, onReady);
    }

    destroyPayPalScript(): void {
        this.scriptService.cleanup(this.paypalWindowName);
    }

    private getUrlForConfig(config: IPayPalUrlConfig): string {
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

        if (config.commit) {
            params.push({
                name: 'commit',
                value: config.commit
            });
        }

        if (config.vault) {
            params.push({
                name: 'vault',
                value: config.vault
            });
        }

        if (config.extraParams) {
            params.push(...config.extraParams);
        }

        return `https://www.paypal.com/sdk/js${this.getQueryString(params)}`;
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
}
