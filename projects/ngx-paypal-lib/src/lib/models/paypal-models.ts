
export class PayPalConfig {

    /**
     * Currency - Defaults to USD if not provided
     */
    public currency?: string;

    /**
    * Order to be created
    */
    public createOrder!: (data: any) => ICreateOrderRequest;

    /**
     * Advanced configuration
     */
    public advanced?: IAdvancedConfiguration;

    /**
     * Client id
     */
    public clientId!: string;

    /**
     * Called when 'onApprove' event occurs
     */
    public onApprove!: (data: IOnApproveCallbackData, actions: any) => void;

    /**
    * Called when authorization on client succeeds
    */
    public onClientAuthorization?: (authorization: IClientAuthorizeCallbackData) => void;

    /**
     * Implement for authorizing on server side
     */
    public authorizeOnServer?: (data: IOnApproveCallbackData, actions: any) => void;

    /**
     * Button style configuration
     */
    public style?: IPayPalButtonStyle;

    /**
     * Error handler
     */
    public onError?: (err: any) => void;

    /**
     * Click handler
     */
    public onClick?: () => void;

    /**
     * Cancel handler
     */
    onCancel?: (data: ICancelCallbackData, actions: any) => void;

    constructor(
        config: {
            clientId: string,
            onApprove: (data: IOnApproveCallbackData, actions: IOnApproveCallbackActions) => void,
            createOrder: (data: any) => ICreateOrderRequest,

            onClientAuthorization?: (authorization: IClientAuthorizeCallbackData) => void,
            advanced?: IAdvancedConfiguration,
            authorizeOnServer?: (data: IOnApproveCallbackData, actions: any) => void,
            currency?: string;
            onError?: (err: any) => void,
            onClick?: () => void,
            onCancel?: (data: ICancelCallbackData, actions: any) => void,
            style?: IPayPalButtonStyle,
        }) {
        Object.assign(this, config);
    }
}

export interface IClientAuthorizeCallbackData extends IOrderDetails {
    links: ILinkDescription[];
}

export interface IOrderDetails {
    create_time: string;
    update_time: string;
    id: string;
    intent: OrderIntent;
    payer: IPayer;
    status: OrderStatus;
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

export type LinkMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'PATCH';

export interface IAdvancedConfiguration {
    updateOrderDetails?: {
        commit?: boolean
    };
    extraQueryParams?: IQueryParam[];
}

export interface IOnApproveCallbackData {
    orderID: string;
    payerID: string;
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

export interface IUnitBreakdown {
    item_total?: IUnitAmount;
    shipping?: IUnitAmount;
    handling?: IUnitAmount;
    tax_total?: IUnitAmount;
    insurance?: IUnitAmount;
    shipping_discount?: IUnitAmount;
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


