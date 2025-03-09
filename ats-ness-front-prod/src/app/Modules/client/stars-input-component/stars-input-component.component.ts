import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxStarsModule } from 'ngx-stars';

@Component({
    selector: 'app-stars-input',
    template: `
        <ngx-stars
            [maxStars]="maxStars"
            [initialStars]="value"
            [readonly]="readonly"
            [size]="size"
            [color]="color"
            (ratingOutput)="onStarsUpdated($event)">
        </ngx-stars>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StarsInputComponentComponent),
            multi: true,
        },
    ],
    imports: [NgxStarsModule],
    standalone: true
})
export class StarsInputComponentComponent implements ControlValueAccessor {
    @Input() maxStars = 5;
    @Input() readonly = false;
    @Input() size = 24;
    @Input() color = '#ffc700';

    value = 0;

    private onChangeCallback = (value: number) => {};
    private onTouchedCallback = () => {};

    // Triggered by the stars component
    onStarsUpdated(value: number): void {
        this.value = value;
        this.onChangeCallback(value); // Notify Angular form control
        this.onTouchedCallback(); // Mark as touched
    }

    writeValue(value: number): void {
        this.value = value || 0; // Initialize value
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn; // Save reference to form control's onChange
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn; // Save reference to form control's onTouched
    }

    setDisabledState(isDisabled: boolean): void {
        this.readonly = isDisabled; // Handle readonly state
    }
}
