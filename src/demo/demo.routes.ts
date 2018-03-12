import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApiComponent } from './api.component';
import { MainComponent } from './main.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: MainComponent
            },
            {
                path: 'api', component: ApiComponent
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DemoRoutes { }
