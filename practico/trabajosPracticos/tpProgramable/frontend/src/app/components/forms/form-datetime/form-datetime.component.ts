import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonDatetime, IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
    selector: 'app-form-datetime',
    templateUrl: './form-datetime.component.html',
    styleUrls: ['./form-datetime.component.scss'],
    standalone: true,
    imports: [IonLabel, IonItem, IonDatetime],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormDatetimeComponent),
            multi: true
        }
    ]
})
export class FormDatetimeComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() class: string = '';

    value: string = '';
    disabled: boolean = false;

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(value: any): void {
        if (value !== undefined) {
            this.value = value;
        }
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onDatetimeChange(event: any): void {
        this.value = event.detail.value;
        this.onChange(this.value);
        this.onTouched();
    }
}