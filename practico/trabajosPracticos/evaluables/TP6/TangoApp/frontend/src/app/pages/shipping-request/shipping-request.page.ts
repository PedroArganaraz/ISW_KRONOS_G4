import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton, IonSelectOption, IonRow, IonCol, IonList, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { ELoadType } from 'src/app/ts/enums/load-type';
import { FormModalSelectComponent } from "../../components/forms/form-modal-select/form-modal-select.component";
import { FormInputComponent } from "../../components/forms/form-input/form-input.component";
import { FormDatetimeComponent } from "../../components/forms/form-datetime/form-datetime.component";
import { FormTextareaComponent } from 'src/app/components/forms/form-textarea/form-textarea.component';
import { ImageImporterComponent } from "../../components/forms/image-importer/image-importer.component";
import { ImageSliderComponent } from "../../components/image-slider/image-slider.component";
import { GeorefService, Localidad, Provincia } from 'src/app/services/georef/georef.service';
import { FormSelectComponent } from 'src/app/components/forms/form-select/form-select.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-shipping-request',
    templateUrl: './shipping-request.page.html',
    styleUrls: ['./shipping-request.page.scss'],
    standalone: true,
    imports: [IonButtons, IonList, IonCol, IonRow, ReactiveFormsModule, IonButton, IonText, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelectOption, FormModalSelectComponent, FormSelectComponent, FormInputComponent, FormDatetimeComponent, FormTextareaComponent, IonMenuButton, ImageImporterComponent, ImageSliderComponent]
})
export class ShippingRequestPage implements OnInit {
    requestForm!: FormGroup;
    uploadedImage: string | ArrayBuffer | null = null;

    imageList: Array<string | ArrayBuffer> = [];

    provincias: Provincia[] = [];

    localidadesRetiro: Localidad[] = [];
    selectedProvinciaIdRetiro: string = '';
    subscriptionRetiro?: Subscription;


    localidadesEntrega: Localidad[] = [];
    selectedProvinciaIdEntrega: string = '';
    subscriptionEntrega?: Subscription;


    get isFormValid(): boolean {
        return this.requestForm.valid;
    }

    get loadTypes() {
        // return Object.values(ELoadType);

        return Object.keys(ELoadType).map((key) => ({
            nombre: key,
            id: ELoadType[key as keyof typeof ELoadType]
        }));
    }

    constructor(private georefService: GeorefService) { }

    ngOnInit() {
        this.getProvincias();

        this.requestForm = new FormGroup({
            // tipo de carga que debe ser transportado
            loadType: new FormControl(ELoadType.Package, Validators.required),

            // dirección de retiro
            retiroCalle: new FormControl("", [Validators.required, Validators.minLength(3)]),
            retiroNumero: new FormControl("", [Validators.required, Validators.minLength(1)]),
            retiroLocalidad: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.minLength(3)]),
            retiroProvincia: new FormControl("", [Validators.required, Validators.minLength(3)]),
            retiroReferencia: new FormControl(""),

            // la fecha de retiro
            pickupDate: new FormControl(new Date(), Validators.required),

            // dirección de entrega
            entregaCalle: new FormControl("", [Validators.required, Validators.minLength(3)]),
            entregaNumero: new FormControl("", [Validators.required, Validators.minLength(1)]),
            entregaLocalidad: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.minLength(3)]),
            entregaProvincia: new FormControl("", [Validators.required, Validators.minLength(3)]),
            entregaReferencia: new FormControl(""),

            // la fecha de entrega
            deliveryDate: new FormControl(new Date(), Validators.required),

            // observación (opcional)
            observation: new FormControl(""),

            // imagenes (opcional) 
            image: new FormControl(null)
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

    // onImageSelected(imageData: string | ArrayBuffer | null) {
    //     this.uploadedImage = imageData;

    //     if (imageData)
    //         this.imageList.push(imageData);
    // }

    onImagesSelected(imageData: Array<string | ArrayBuffer>) {

        this.imageList = imageData;
    }

    // Obtener todas las provincias
    getProvincias(): void {
        this.georefService.getProvincias().subscribe((response: any) => {
            this.provincias = response.provincias; // Guardar provincias obtenidas
        });
    }

    // Obtener localidades al seleccionar una provincia
    onProvinciaRetiroChange(provinciaId: string): void {

        this.subscriptionRetiro?.unsubscribe();

        this.selectedProvinciaIdRetiro = provinciaId;

        this.subscriptionRetiro = this.georefService.getLocalidadesPorProvincia(provinciaId).subscribe((response: any) => {
            this.localidadesRetiro = response.localidades; // Guardar localidades obtenidas
        });

        if (this.selectedProvinciaIdRetiro === '') {
            this.requestForm.get('retiroLocalidad')?.disable();
        }
        else {
            this.requestForm.get('retiroLocalidad')?.enable();
        }
    }

    onProvinciaEntregaChange(provinciaId: string): void {

        this.subscriptionEntrega?.unsubscribe();

        this.selectedProvinciaIdEntrega = provinciaId;

        this.subscriptionEntrega = this.georefService.getLocalidadesPorProvincia(provinciaId).subscribe((response: any) => {
            this.localidadesEntrega = response.localidades; // Guardar localidades obtenidas
        });

        if (this.selectedProvinciaIdEntrega === '') {
            this.requestForm.get('entregaLocalidad')?.disable();
        }
        else {
            this.requestForm.get('entregaLocalidad')?.enable();
        }
    }

    // onImageSelected()
}
