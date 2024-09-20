import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
    selector: 'app-form-input',
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss'],
    standalone: true,
    imports: [IonLabel, IonItem, IonInput,],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormInputComponent),
            multi: true
        }
    ]
})
export class FormInputComponent implements ControlValueAccessor {
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

    onInputChange(event: any): void {
        this.value = event.target.value;
        this.onChange(this.value);
        this.onTouched();
    }
}