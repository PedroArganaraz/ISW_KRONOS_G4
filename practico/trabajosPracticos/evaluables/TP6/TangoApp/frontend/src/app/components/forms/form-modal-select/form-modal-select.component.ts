import { Component, EventEmitter, forwardRef, Input, Output, ViewChild, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal, IonItem, IonLabel, IonSelect, IonSelectOption, IonSearchbar, IonHeader, IonButtons, IonButton, IonTitle, IonToolbar, IonContent, IonList } from "@ionic/angular/standalone";

export interface FormOption {
    nombre: string;
    id: string;
}

@Component({
    selector: 'app-form-modal-select',
    templateUrl: './form-modal-select.component.html',
    styleUrls: ['./form-modal-select.component.scss'],
    standalone: true,
    imports: [IonList, IonContent, IonToolbar, IonTitle, IonButton, IonButtons, IonHeader, IonSearchbar, IonItem, IonLabel, IonSelect, IonSelectOption, IonModal],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormModalSelectComponent),
            multi: true,
        }
    ]
})
export class FormModalSelectComponent implements ControlValueAccessor, OnInit {
    @Input() options: FormOption[] = [];
    @Input() label: string = '';
    @Input() class: string = '';
    @Input() selectText: string = 'Select an option';

    @Output() valueChange = new EventEmitter<string>();

    @ViewChild('modal', { static: true }) modal!: IonModal;

    value: any;
    disabled: boolean = false;

    filteredOptions: FormOption[] = [];
    searchQuery: string = '';


    get currentOptionName(): string {
        return this.options.find(option => option.id === this.value)?.nombre || this.selectText;
    }

    onChange: any = () => { };
    onTouched: any = () => { };

    ngOnInit() {
        this.filteredOptions = this.options;
    }

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
        this.valueChange.emit(this.value);
        this.onTouched();
    }

    openModal() {
        this.clearModal();
        this.modal.present();
    }

    clearModal() {
        this.filteredOptions = this.options;
        this.searchQuery = '';
    }

    filterOptions(query: string) {
        console.log('filtering options');
        if (query === '') {
            this.filteredOptions = this.options;
            return;
        }
        this.searchQuery = query.toLowerCase();
        this.filteredOptions = this.options.filter(option =>
            option.nombre.toLowerCase().includes(this.searchQuery)
        );
    }

    selectOption(option: FormOption) {
        this.value = option.id;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
        this.modal.dismiss();
    }
}