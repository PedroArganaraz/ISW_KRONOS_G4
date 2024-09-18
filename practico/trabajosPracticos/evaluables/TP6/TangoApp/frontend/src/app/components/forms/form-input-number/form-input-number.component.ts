import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
    selector: 'app-form-input-number',
    templateUrl: './form-input-number.component.html',
    styleUrls: ['./form-input-number.component.scss'],
    standalone: true,
    imports: [IonLabel, IonItem, IonInput],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormInputNumberComponent),
            multi: true
        }
    ]
})
export class FormInputNumberComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() class: string = '';

    value: number | null = null; // Changed to number type, can be null initially
    disabled: boolean = false;

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.value = Number(value); // Ensure the value is cast to a number
        } else {
            this.value = null;
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

    onInputChange(event: any): void {
        const inputValue = event.target.value;
        const numericValue = inputValue !== '' ? Number(inputValue) : null;
        this.value = numericValue;
        this.onChange(this.value);
        this.onTouched();
    }
}