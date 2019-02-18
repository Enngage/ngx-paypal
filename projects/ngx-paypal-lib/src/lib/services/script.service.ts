import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class ScriptService {

    constructor(
        protected zone: NgZone,
    ) {
    }

    registerScript(url: string, globalVar: string, onReady: (globalVar: any) => void): void {
        if ((window as any)[globalVar]) {
            // global variable is present = script was already loaded
            return;
        }

        // prepare script elem
        const scriptElem = document.createElement('script');
        scriptElem.id = this.getElemId(globalVar);
        scriptElem.innerHTML = '';
        scriptElem.onload = () => {
            this.zone.run(() => {
                onReady((window as any)[globalVar]);
            });
        };
        scriptElem.src = url;
        scriptElem.async = true;
        scriptElem.defer = true;

        // add script to header
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
    }

    cleanup(url: string, globalVar: string): void {
        (window as any)[globalVar] = undefined;
        (window as any)[url] = undefined;

        // remove script from DOM
        const elem = document.getElementById(this.getElemId(globalVar));

        if (elem) {
            document.removeChild(elem);
        }
    }

    private getElemId(globalVar: string): string {
        return `ngx-paypal-script-elem-${globalVar}`;
    }
}
