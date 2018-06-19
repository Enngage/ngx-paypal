export class Utilities {
    newGuid() {
       return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
           // tslint:disable-next-line:no-bitwise triple-equals
           const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
           return v.toString(16);
       });
   }
}

export let utilities = new Utilities();
