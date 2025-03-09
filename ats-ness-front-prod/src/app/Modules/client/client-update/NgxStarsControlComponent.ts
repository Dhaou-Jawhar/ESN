import { Component, forwardRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgxStarsModule } from "ngx-stars";

@Component({
    selector: 'ngx-stars-control',
    template: `
        <ngx-stars
            [color]="color"
            [initialStars]="value"
            (ratingOutput)="onStarsChange($event)"
        ></ngx-stars>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxStarsControlComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [
        NgxStarsModule
    ]
})
export class NgxStarsControlComponent implements ControlValueAccessor, AfterViewInit {
    @Input() color: string = '#ffc700';
    @Input() initialStars: number = 0;

    private _value: number = 0;

    get value(): number {
        return this._value;
    }

    set value(val: number) {
        this._value = val;
    }

    onChange: (value: number) => void = () => {};
    onTouched: () => void = () => {};

    writeValue(value: number): void {
        if (value !== undefined) {
            this.value = value;
        }
    }

    registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    onStarsChange(value: number): void {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    ngAfterViewInit() {
        console.log('After view init - initialStars:', this.initialStars);
        this.value = this.initialStars;
    }
}
