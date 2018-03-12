import { Observable } from 'rxjs/Observable';

import { PayPalFunding } from '..';
import { PayPalEnvironment } from './paypal-environment';
import { PayPalIntegrationType } from './paypal-integration';

export class PayPalConfig {

    /**
     * Show 'Pay Now' button config
     */
    public commit = true;

    /**
     * Called to create new payment for server side integration
     */
    public payment?: () => Observable<string>;

    /**
     * Called to execute payment for server side integration
     */
    public onAuthorize?: (data: IPayPalPaymentCompleteData, actions: any) => Observable<void>;

    /**
     * Client tokens for client side integration
     */
    public client?: IPaypalClient;

    /**
     * Array of transaction, required for client side integration
     */
    public transactions?: IPayPalTransaction[];

    /**
     * Called for client side integration when payment is executed
     */
    public onPaymentComplete?: (data: IPayPalPaymentCompleteData, actions: any) => void;

    /**
     * Button configuration
     */
    public button?:
        IPayPalCheckoutButton | IPayPalCreditButton | IPayPalPayButton |
        IPayPalBuyNowButton | IPayPalButton | IPayPalVerticalButtons;

    /**
     * Credit button config
     */
    public creditButton?: IPayPalCreditButton;

    /**
     * Paypal funding configuration
     */
    public funding?: IPayPalFunding;

    /**
     * Called when PayPal experiences an error
     */
    public onError?: (err: any) => void;

    /**
     * Called when user cancels payment
     */
    public onCancel?: (data: IPayPalCancelPayment, actions: any) => void;

    constructor(
        /**
         * Type of the integration
         */
        public integrationType: PayPalIntegrationType,
        /**
         * Environment
         */
        public environment: PayPalEnvironment,
        config: {
            onError?: (err: any) => void,
            onCancel?: (data: IPayPalCancelPayment, actions: any) => void,
            payment?: () => Observable<string>,
            onAuthorize?: (data: IPayPalPaymentCompleteData, actions: any) => Observable<void>,
            client?: IPaypalClient,
            onPaymentComplete?: (data: IPayPalPaymentCompleteData, actions: any) => void,
            transactions?: IPayPalTransaction[],
            commit?: boolean,
            button?: IPayPalCheckoutButton | IPayPalCreditButton | IPayPalPayButton
            | IPayPalBuyNowButton | IPayPalButton | IPayPalVerticalButtons,
            funding?: IPayPalFunding
        }) {
        Object.assign(this, config);
    }
}

export interface IPayPalPaymentCompleteData {
    intent: string;
    orderID: string;
    payerID: string;
    paymentID: string;
    paymentToken: string;
    returnUrl: string;
}

export interface IPayPalCancelPayment {
    data: IPayPalCancelPaymentData;
    actions: any;
}

export interface IPayPalCancelPaymentData {
    billingID: string;
    cancelUrl: string;
    intent: string;
    paymentID: string;
    paymentToken: string;
}

export interface IPaypalClient {
    sandbox?: string;
    production?: string;
}

export interface IPayPalTransaction {
    amount: IPayPalAmount;
}

export interface IPayPalAmount {
    total: number;
    currency: string;
}

export interface IPayPalCheckoutButton {
    label: 'checkout';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'black';
}

export interface IPayPalCreditButton {
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    tagline: false;
}

export interface IPayPalPayButton {
    label: 'pay';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'black';
}

export interface IPayPalBuyNowButton {
    label: 'buynow';
    fundingicons?: boolean;
    branding?: boolean;
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'black';
}
export interface IPayPalButton {
    tagline: false;
    label: 'paypal';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'black';
}

export interface IPayPalVerticalButtons {
    layout: 'vertical' | 'horizontal';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'black';
}

export interface IPayPalFunding {
    allowed: PayPalFunding[];
    disallowed: PayPalFunding[];
}

