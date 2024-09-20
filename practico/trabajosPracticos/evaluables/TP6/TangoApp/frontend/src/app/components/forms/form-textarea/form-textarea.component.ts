import { IonItem, IonTextarea, IonLabel } from '@ionic/angular/standalone';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-form-textarea',
    templateUrl: './form-textarea.component.html',
    styleUrls: ['./form-textarea.component.scss'],
    standalone: true,
    imports: [IonLabel, IonItem, IonTextarea],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormTextareaComponent),
            multi: true
        }
    ]
})
export class FormTextareaComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() class: string = '';

    value: string = '';
    disabled: boolean = false;

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(value: any): void {
        this.value = value || '';
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

    onTextareaChange(event: any): void {
        const newValue = event.detail.value;
        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
    }
}