import { TipoDeCargaService } from './../../services/tipo-de-carga/tipo-de-carga.service';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { Swiper } from 'swiper';
import { FormInputNumberComponent } from "../../components/forms/form-input-number/form-input-number.component";
import { TipoCarga } from 'src/app/ts/classes/models/tipoCarga';
import { ShippingRequestService } from 'src/app/services/shipping-request/shipping-request.service';
import { Domicilio } from 'src/app/ts/classes/models/domicilio';
import { PedidoEnvio } from 'src/app/ts/classes/models/pedidoEnvio';

@Component({
    selector: 'app-shipping-request',
    templateUrl: './shipping-request.page.html',
    styleUrls: ['./shipping-request.page.scss'],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [IonButtons, IonList, IonCol, IonRow, ReactiveFormsModule, IonButton, IonText, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelectOption, FormModalSelectComponent, FormSelectComponent, FormInputComponent, FormDatetimeComponent, FormTextareaComponent, IonMenuButton, ImageImporterComponent, ImageSliderComponent, FormInputNumberComponent]
})
export class ShippingRequestPage implements OnInit, AfterViewInit {
    @ViewChild('swiper', { static: false }) swiperRef?: ElementRef;
    swiper?: Swiper;

    requestForm!: FormGroup;
    uploadedImage: string | ArrayBuffer | null = null;

    imageList: Array<string | ArrayBuffer> = [];

    provincias: Provincia[] = [];
    loadTypes: TipoCarga[] = [];

    localidadesRetiro: Localidad[] = [];
    selectedProvinciaIdRetiro: string = '';
    subscriptionRetiro?: Subscription;


    localidadesEntrega: Localidad[] = [];
    selectedProvinciaIdEntrega: string = '';
    subscriptionEntrega?: Subscription;

    // canSlideNext: boolean = false;
    currentSlideFields: Array<string> = [];

    activeIndex: number = 0;
    lastIndex: number = 2;

    get isFormValid(): boolean {
        return !this.requestForm.invalid;
    }



    // get loadTypes() {
    //     // return Object.values(ELoadType);

    //     return Object.keys(ELoadType).map((key) => ({
    //         nombre: key,
    //         id: ELoadType[key as keyof typeof ELoadType]
    //     }));
    // }

    constructor(private georefService: GeorefService, private tipoDeCargaService: TipoDeCargaService, private pedidoEnvioService: ShippingRequestService) {

    }

    ngOnInit() {
        this.getProvincias();
        this.getTiposDeCarga();

        this.requestForm = new FormGroup({
            // tipo de carga que debe ser transportado
            loadType: new FormControl(ELoadType.Paquete, Validators.required),

            // dirección de retiro
            retiroCalle: new FormControl("", [Validators.required]),
            retiroNumero: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
            retiroLocalidad: new FormControl({ value: "", disabled: true }, [Validators.required]),
            retiroProvincia: new FormControl("", [Validators.required]),
            retiroReferencia: new FormControl(""),

            // la fecha de retiro
            pickupDate: new FormControl<Date | null>(null, [Validators.required, Validators.min(1)]),

            // dirección de entrega
            entregaCalle: new FormControl("", [Validators.required]),
            entregaNumero: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
            entregaLocalidad: new FormControl({ value: "", disabled: true }, [Validators.required]),
            entregaProvincia: new FormControl("", [Validators.required]),
            entregaReferencia: new FormControl(""),

            // la fecha de entrega
            deliveryDate: new FormControl<Date | null>(null, [Validators.required, Validators.min(1)]),

            // observación (opcional)
            observation: new FormControl(""),

            // imagenes (opcional) 
            image: new FormControl(null)
        }, { validators: this.dateValidator });

    }

    ngAfterViewInit(): void {
        this.onSwiperReady();
    }


    dateValidator(control: AbstractControl): ValidationErrors | null {
        const formGroup = control as FormGroup;
        const pickupDate = formGroup.get('pickupDate')?.value;
        const deliveryDate = formGroup.get('deliveryDate')?.value;

        return deliveryDate >= pickupDate ? null : { dateInvalid: true };
    }

    onSubmit() {
        this.requestForm.markAllAsTouched();

        if (this.requestForm.invalid) {
            console.log("Form is invalid");
        } else {
            const formValue = this.requestForm.value;
            console.log("Form data:", formValue);

            const domicilioRetiro = new Domicilio(
                formValue.retiroCalle,
                formValue.retiroNumero,
                formValue.retiroLocalidad,
                formValue.retiroProvincia,
                formValue.retiroReferencia
            );

            const domicilioEntrega = new Domicilio(
                formValue.entregaCalle,
                formValue.entregaNumero,
                formValue.entregaLocalidad,
                formValue.entregaProvincia,
                formValue.entregaReferencia
            );

            const tipoCarga = new TipoCarga(formValue.loadType);

            const pedidoEnvio = new PedidoEnvio(
                new Date(formValue.pickupDate),
                new Date(formValue.deliveryDate),
                formValue.image,
                formValue.observation,
                domicilioEntrega,
                domicilioRetiro,
                tipoCarga
            );

            this.pedidoEnvioService.create(pedidoEnvio).subscribe({
                next: (response) => {
                    console.log("Pedido created successfully:", response);
                },
                error: (error) => {
                    console.log("Error creating pedido:", error);
                },
                complete: () => {
                    console.log("Request completed.");
                }
            });
        }
    }


    onImagesSelected(imageData: Array<string | ArrayBuffer>) {

        this.imageList = imageData;
    }

    // Obtener todas las provincias
    getProvincias(): void {
        this.georefService.getProvincias().subscribe((response: any) => {
            this.provincias = response.provincias; // Guardar provincias obtenidas
        });
    }

    getTiposDeCarga(): void {
        this.tipoDeCargaService.getAll().subscribe((response: any) => {
            console.log("tipos de carga: ", response);
            // this.loadTypes = response.
            this.loadTypes = response;

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

    onSwiperReady() {
        this.swiper = this.swiperRef?.nativeElement.swiper;

        console.log('swiper ready? ', this.swiper)

        this.swiper?.on('slideChange', this.onSlideChange.bind(this));
        if (this.swiper) this.swiper.allowTouchMove = false;

        this.onSlideChange();
    }

    onSlideChange(swiper?: Swiper) {
        // Get the active index and validate current slide's form controls
        this.activeIndex = (swiper ? swiper.activeIndex : this.swiper?.activeIndex) ?? 0;

        console.log('slide change ', this.activeIndex);
        // if (activeIndex)
        //     this.validateCurrentSlide(activeIndex);


    }

    swipeNext() {
        if (this.canSlideNext()) {
            this.swiper?.slideNext();

            Object.keys(this.requestForm.controls).forEach(control => {
                this.requestForm.get(control)?.markAsUntouched();
            });
        }
        else {
            this.requestForm.markAllAsTouched();
            // this.requestForm.updateValueAndValidity();
            // this.requestForm.markAllAsTouched();
        }

    }

    swipePrev() {
        this.swiper?.slidePrev();

    }

    canSlideNext(): boolean {

        let fieldsToValidate: Array<string> = []

        switch (this.activeIndex) {
            case 0:
                fieldsToValidate = ['loadType', 'retiroCalle', 'retiroNumero', 'retiroProvincia', 'retiroLocalidad', 'pickupDate'];
                break;
            case 1:
                fieldsToValidate = ['entregaCalle', 'entregaNumero', 'entregaProvincia', 'entregaLocalidad', 'deliveryDate'];
                break;
            case 2:
                fieldsToValidate = ['observation'];
                break;
            default:
                fieldsToValidate = [];
        }

        console.log('current slides ', fieldsToValidate)
        return fieldsToValidate.every(control => this.requestForm.get(control)?.valid);
    }

    // validateCurrentSlide(activeIndex: number) {

    //     switch (activeIndex) {
    //         case 0:
    //             this.currentSlideFields = ['loadType', 'retiroCalle', 'retiroNumero', 'retiroProvincia', 'retiroLocalidad', 'pickupDate'];
    //             break;
    //         case 1:
    //             this.currentSlideFields = ['entregaCalle', 'entregaNumero', 'entregaProvincia', 'entregaLocalidad', 'deliveryDate'];
    //             break;
    //         case 2:
    //             this.currentSlideFields = ['observation'];
    //             break;
    //         default:
    //             this.currentSlideFields = [];
    //     }

    // }
}
