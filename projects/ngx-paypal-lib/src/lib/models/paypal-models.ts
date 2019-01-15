import { Observable } from 'rxjs';

import { PayPalFunding } from './paypal-funding';
import { PayPalEnvironment } from './paypal-environment';
import { PayPalIntegrationType } from './paypal-integration';

export class PayPalConfig {

    /**
     * Show 'Pay Now' button config
     */
    public commit = true;

    /**
     * Set the intent of the payment.
     */
    public intent = 'sale';

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
     * Payment Experience configurations
     */
    public experience?: IPayPalExperience;

    /**
     * Called for client side integration when payment is executed
     */
    public onPaymentComplete?: (data: IPayPalPaymentCompleteData, actions: any) => void;

    /**
     * Button configuration
     */
    public button?: IPayPalButtonStyle;

    /**
     * Paypal funding configuration
     */
    public funding?: IPayPalFunding;

    /**
     * Called when PayPal experiences an error
     */
    public onError?: (err: any) => void;

    /**
     * This handler will be called for every click on the PayPal button
     */
    public onClick?: () => void;

    /**
     * Called when user cancels payment
     */
    public onCancel?: (data: IPayPalCancelPayment, actions: any) => void;

    /**
     * Can be used to validation as can be seen here: https://developer.paypal.com/demo/checkout/#/pattern/validation
     */
    public validate?: (actions: any) => void;

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
            onClick?: () => void,
            validate?: (actions: any) => void;
            onCancel?: (data: IPayPalCancelPayment, actions: any) => void,
            payment?: () => Observable<string>,
            intent?: string ,
            onAuthorize?: (data: IPayPalPaymentCompleteData, actions: any) => Observable<void>,
            client?: IPaypalClient,
            onPaymentComplete?: (data: IPayPalPaymentCompleteData, actions: any) => void,
            transactions?: IPayPalTransaction[],
            note_to_payer?: string;
            experience?: IPayPalExperience,
            commit?: boolean,
            button?: IPayPalButtonStyle,
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
    description?: string;
    custom?: string;
    payment_options?: IPayPalTransactionPaymentOptions;
    invoice_number?: string;
    soft_descriptor?: string;
    item_list?: IPayPalTransactionItemList;
}

export interface IPayPalTransactionItemList {
    items?: IPayPalTransactionItem[];
    shipping_address?: IPayPalTransactionShippingAddress;
}

export interface IPayPalTransactionItem {
    name: string;
    currency: string;
    price: number;
    quantity: number;

    description?: string;
    tax?: number;
    sku?: string;
}

export interface IPayPalAmount {
    total: number;
    currency: string;
    details?: IPayPalAmountDetails;
}

export interface IPayPalTransactionShippingAddress {
    recipient_name: string;
    line1: string;
    line2?: string;
    city: string;
    country_code: string;
    postal_code: string;
    phone: string;
    state: string;
}

export interface IPayPalAmountDetails {
    subtotal: number;
    tax: number;
    shipping: number;
    handling_fee: number;
    shipping_discount: number;
    insurance: number;
}

export interface IPayPalTransactionPaymentOptions {
    allowed_payment_method?: string;
}

export interface IPayPalExperience {
    /** Indicates whether PayPal displays shipping address fields on the experience pages */
    noShipping?: boolean;
    /** A label that overrides the business name in the PayPal account on the PayPal pages. Max length: 127 characters. */
    brandName?: string;
    /** URL to the logo image (gif, jpg, or png). The image's maximum width is 190 pixels and maximum height is 60 pixels. */
    logoImage?: string;
    /** Locale in which to display PayPal page */
    localeCode?: string;
}

export interface IPayPalButtonStyle {
    label?: 'checkout' | 'pay' | 'buynow' | 'paypal';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver' | 'black';
    layout?: 'horizontal' | 'vertical';
    tagline?: false;
    fundingicons?: boolean;
    branding?: boolean;
}

export interface IPayPalFunding {
    allowed: PayPalFunding[];
    disallowed: PayPalFunding[];
}

