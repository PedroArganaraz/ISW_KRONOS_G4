import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/angular/standalone";

@Component({
    selector: 'app-form-select',
    templateUrl: './form-select.component.html',
    styleUrls: ['./form-select.component.scss'],
    standalone: true,
    imports: [IonItem, IonLabel, IonSelect, IonSelectOption],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormSelectComponent),
            multi: true,
        }
    ]
})
export class FormSelectComponent implements ControlValueAccessor {
    @Input() options: any[] = [];
    @Input() label: string = '';
    @Input() class: string = '';

    value: any;
    disabled: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onSelectChange(event: any) {
        this.value = event.detail.value;
        this.onChange(this.value);
        this.onTouched();
    }
}