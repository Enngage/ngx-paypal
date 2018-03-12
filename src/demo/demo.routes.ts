import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MainComponent } from './main.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: MainComponent
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DemoRoutes { }
