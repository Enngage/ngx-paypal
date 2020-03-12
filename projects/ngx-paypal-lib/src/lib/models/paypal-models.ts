
export interface IPayPalConfig {

    /**
     * Currency - Defaults to USD if not provided
     */
    currency?: string;

    /**
    * Use when creating order on client
    */
    createOrderOnClient?: (data: any) => ICreateOrderRequest;

    /**
     * Use for creating orders on server. PayPal expects you to return 'orderId' in this method
     */
    createOrderOnServer?: (data: any) => Promise<string>;

    /**
     * Advanced configuration
     */
    advanced?: IAdvancedConfiguration;

    /**
     * Client id
     */
    clientId: string;

    /**
     * Shipping callback
     * see https://developer.paypal.com/docs/checkout/integration-features/shipping-callback/
     */
    onShippingChange?: OnShippingChangeCallback;

    /**
     * Called when 'onApprove' event occurs
     */
    onApprove?: (data: IOnApproveCallbackData, actions: any) => void;

    /**
    * Called when authorization on client succeeds
    */
    onClientAuthorization?: (authorization: IClientAuthorizeCallbackData) => void;

    /**
     * Implement for authorizing on server side
     */
    authorizeOnServer?: (data: IOnApproveCallbackData, actions: any) => Promise<any>;

    /**
     * Button style configuration
     */
    style?: IPayPalButtonStyle;

    /**
     * Error handler
     */
    onError?: (err: any) => void;

    /**
     * Click handler
     */
    onClick?: (data: any, actions: IOnClickCallbackActions) => void;

    /**
     * Cancel handler
     */
    onCancel?: (data: ICancelCallbackData, actions: any) => void;

    /**
     * Init handler.
     * can be used for validation, see: https://developer.paypal.com/docs/checkout/integration-features/validation/#
     */
    onInit?: (data: IInitCallbackData, actions: IOnInitCallbackActions) => void;

    /**
     * Create subscription handler
     * https://developer.paypal.com/docs/subscriptions/integrate/
     */
    createSubscription?: (data: ICreateSubscriptionCallbackData, actions: ICreateSubscriptionCallbackActions) => void;
}

export type TrueFalse = 'true' | 'false';

export interface IPayPalUrlConfig {
    clientId: string;
    currency?: string;
    commit?: TrueFalse;
    extraParams?: IQueryParam[];
}

export interface IOrderDetails {
    create_time: string;
    update_time: string;
    id: string;
    intent: OrderIntent;
    payer: IPayer;
    status: OrderStatus;
    links: ILinkDescription[];
    purchase_units: IPurchaseUnit[];
}

export interface IClientAuthorizeCallbackData extends IOrderDetails {
    links: ILinkDescription[];
}

export interface ILinkDescription {
    href: string;
    rel: String;
    method?: LinkMethod;
}

export interface IQueryParam {
    name: string;
    value: string;
}

export type OnShippingChangeCallback = (data: IOnShippingChangeData, actions: IOnShippingChangeActions) => any;

export interface IOnShippingChangeData {
    paymentToken: string;
    shipping_address: any;
    selected_shipping_method?: any;
}

export interface IOnShippingChangeActions {
    resolve: () => any;
    reject: () => any;
    patch: () => any;
}

export type LinkMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'PATCH';

export interface IAdvancedConfiguration {
    commit?: TrueFalse;
    extraQueryParams?: IQueryParam[];
}

export interface IOnApproveCallbackData {
    orderID: string;
    payerID: string;
    subscriptionID: string;
}

export interface ICreateOrderCallbackActions {
    order: {
        create: (order: ICreateOrderRequest) => Promise<any>;
    };
}

export interface ICancelCallbackData {
    orderID: string;
}

export interface IOnApproveCallbackActions {
    redirect: () => void;
    restart: () => void;
    order: {
        authorize: () => Promise<any>;
        capture: () => Promise<any>;
        get: () => Promise<IOrderDetails>;
        patch: () => Promise<any>;
    };
}

export interface IOnInitCallbackActions {
    enable: () => void;
    disable: () => void;
}

export interface ICreateSubscriptionCallbackActions {
    subscription: {
        create: (subscription: ICreateSubscriptionRequest) => Promise<any>;
    };
}

// tslint:disable-next-line:no-empty-interface
export interface IInitCallbackData {
}

// tslint:disable-next-line:no-empty-interface
export interface ICreateSubscriptionCallbackData {
}

export interface IOnClickCallbackActions {
    resolve: () => void;
    reject: () => void;
}

export interface IPayPalButtonStyle {
    label?: 'paypal' | 'checkout' | 'pay' | 'installment';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    shape?: 'pill' | 'rect';
    color?: 'gold' | 'blue' | 'silver';
    layout?: 'horizontal' | 'vertical';
    tagline?: boolean;
}

export interface ICreateOrderRequest {
    intent: OrderIntent;
    purchase_units: IPurchaseUnit[];

    payer?: IPayer;
    application_context?: IApplicationContext;

}

export interface ICreateSubscriptionRequest {
    plan_id: string;
}

export interface IPayer {
    name?: IPartyName;
    email_address?: string;
    payer_id?: string;
    birth_date?: string;
    tax_info?: ITaxInfo;
    address?: IAddressPortable;
}

export interface IApplicationContext {
    brand_name?: string;
    locale?: string;
    landing_page?: PaypalLandingPage;
    shipping_preference?: ShippingPreference;
    user_action?: PayPalUserAction;
    payment_method?: IPaymentMethod;
    return_url?: string;
    cancel_url?: string;
}

export interface IPaymentMethod {
    payer_selected?: PayerSelected;
    payee_preferred?: PayeePreferred;
}

export type PayeePreferred = 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';

export type PayerSelected = 'PAYPAL_CREDIT' | 'PAYPAL';

export type PayPalUserAction = 'CONTINUE' | 'PAY_NOW';

export type ShippingPreference = 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';

export type PaypalLandingPage = 'LOGIN' | 'BILLING';

export type OrderIntent = 'CAPTURE' | 'AUTHORIZE';

export type DisbursementMode = 'INSTANT' | 'DELAYED';

export type ItemCategory = 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';

export type PhoneType = 'FAX' | 'HOME' | 'MOBILE' | 'OTHER' | 'PAGER';

export type TaxIdType = 'BR_CPF' | 'BR_CNPJ';

export interface IPhone {
    phone_type?: PhoneType;
    phone_number?: IPhoneNumber;
}

export interface ITaxInfo {
    tax_id: string;
    tax_id_type: TaxIdType;
}

export interface IPhoneNumber {
    national_number: string;
}

export interface IPurchaseUnit {
    amount: IUnitAmount;

    reference_id?: string;
    payee?: IPayee;
    payment_instruction?: IPaymentInstructions;
    description?: string;
    custom_id?: string;
    invoice_id?: string;
    soft_descriptor?: string;
    items: ITransactionItem[];
    shipping?: IShipping;
}

export interface IPayee {
    email_address?: string;
    merchant_id?: string;
}

export interface IPaymentInstructions {
    platform_fees?: IPlatformFee[];
    disbursement_mode?: DisbursementMode;
}

export interface IPlatformFee {
    amount: IUnitAmount;
    payee?: IPayee;
}

export interface ITransactionItem {
    name: string;
    unit_amount: IUnitAmount;
    quantity: string;

    description?: string;
    sku?: string;
    category?: ItemCategory;
    tax?: ITax;
}

export interface ITax {
    currency_code: string;
    value: string;
}

export interface IUnitAmount {
    currency_code: string;
    value: string;
    breakdown?: IUnitBreakdown;
}

export interface IMoney {
    currency_code: string;
    value: string;
}

export interface IUnitBreakdown {
    item_total?: IUnitAmount;
    shipping?: IUnitAmount;
    handling?: IUnitAmount;
    tax_total?: IUnitAmount;
    insurance?: IUnitAmount;
    shipping_discount?: IUnitAmount;
    discount?: IMoney;
}

export interface IPartyName {
    prefix?: string;
    given_name?: string;
    surname?: string;
    middle_name?: string;
    suffix?: string;
    alternate_full_name?: string;
    full_name?: string;
}

export interface IAddressPortable {
    country_code: string;

    address_line_1?: string;
    address_line_2?: string;
    admin_area_2?: string;
    admin_area_1?: string;
    postal_code?: string;
}

export interface IShipping {
    name?: IPartyName;
    address?: IAddressPortable;
}

export type OrderStatus = 'APPROVED' | 'SAVED' | 'CREATED' | 'VOIDED' | 'COMPLETED';


