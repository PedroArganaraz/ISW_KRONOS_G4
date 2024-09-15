import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton, IonSelectOption, IonRow, IonCol, IonList, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { ELoadType } from 'src/app/ts/enums/load-type';
import { FormSelectComponent } from "../../components/forms/form-select/form-select.component";
import { FormInputComponent } from "../../components/forms/form-input/form-input.component";
import { FormDatetimeComponent } from "../../components/forms/form-datetime/form-datetime.component";
import { FormTextareaComponent } from 'src/app/components/forms/form-textarea/form-textarea.component';
import { ImageImporterComponent } from "../../components/forms/image-importer/image-importer.component";
import { ImageSliderComponent } from "../../components/image-slider/image-slider.component";

@Component({
    selector: 'app-shipping-request',
    templateUrl: './shipping-request.page.html',
    styleUrls: ['./shipping-request.page.scss'],
    standalone: true,
    imports: [IonButtons, IonList, IonCol, IonRow, ReactiveFormsModule, IonButton, IonText, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelectOption, FormSelectComponent, FormInputComponent, FormDatetimeComponent, FormTextareaComponent, IonMenuButton, ImageImporterComponent, ImageSliderComponent]
})
export class ShippingRequestPage implements OnInit {
    requestForm!: FormGroup;
    uploadedImage: string | ArrayBuffer | null = null;

    imageList: Array<string | ArrayBuffer> = [];


    get isFormValid(): boolean {
        return this.requestForm.valid;
    }

    get loadTypes() {
        return Object.values(ELoadType);
    }

    constructor() { }

    ngOnInit() {
        this.requestForm = new FormGroup({
            // tipo de carga que debe ser transportado, 
            loadType: new FormControl(ELoadType.Package, Validators.required),

            // dirección y fecha de retiro, 
            pickupAddress: new FormControl("", [Validators.required, Validators.minLength(5)]),
            pickupDate: new FormControl(new Date(), Validators.required),

            // la dirección y fecha de entrega, 
            deliveryAddress: new FormControl("", [Validators.required, Validators.minLength(5)]),
            deliveryDate: new FormControl(new Date(), Validators.required),

            // y, opcionalmente, una observación que detalle 
            // necesidades de almacenamiento o transporte 
            // (por ejemplo: fragilidad, temperatura mínima, evitar el sol).
            observation: new FormControl("") // Este es opcional
        }, { validators: this.dateValidator });
    }

    dateValidator(control: AbstractControl): ValidationErrors | null {
        const formGroup = control as FormGroup;
        const pickupDate = formGroup.get('pickupDate')?.value;
        const deliveryDate = formGroup.get('deliveryDate')?.value;

        return deliveryDate >= pickupDate ? null : { dateInvalid: true };
    }

    onSubmit() {
        if (this.isFormValid) {
            console.log("Form data:", this.requestForm.value);
        } else {
            console.log("Form is invalid");
        }
    }

    onImageSelected(imageData: string | ArrayBuffer | null) {
        this.uploadedImage = imageData;
        
        if (imageData)
            this.imageList.push(imageData);
    }
}
