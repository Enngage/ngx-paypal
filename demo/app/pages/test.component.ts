import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './test.component.html'
})
export class TestComponent {

    constructor(
    ) {
    }
}
