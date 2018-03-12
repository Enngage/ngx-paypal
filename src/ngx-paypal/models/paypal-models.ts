export class PayPalConfig {

    public clientId: string;

    constructor(
        config: {
            clientId: string;
        }
    ) {
        Object.assign(this, config);
    }
}
