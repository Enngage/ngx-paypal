import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DemoModule } from './src/demo.module';

platformBrowserDynamic().bootstrapModule(DemoModule)
  .catch(err => console.log(err));
