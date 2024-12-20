import { TipoDeCargaService } from './../../services/tipo-de-carga/tipo-de-carga.service';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton, IonSelectOption, IonRow, IonCol, IonList, IonButtons, IonMenuButton, ModalController } from '@ionic/angular/standalone';
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
import { ErrorModalComponent } from 'src/app/components/modal/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/components/modal/success-modal/success-modal.component';

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

    constructor(
        private georefService: GeorefService,
        private tipoDeCargaService: TipoDeCargaService,
        private pedidoEnvioService: ShippingRequestService,
        private modalController: ModalController,
    ) {

    }

    ngOnInit() {
        this.getProvincias();
        this.getTiposDeCarga();
        this.getPedidos();

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
            pickupDate: new FormControl<Date | null>(null, [Validators.required, this.pickupValidator()]),

            // dirección de entrega
            entregaCalle: new FormControl("", [Validators.required]),
            entregaNumero: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
            entregaLocalidad: new FormControl({ value: "", disabled: true }, [Validators.required]),
            entregaProvincia: new FormControl("", [Validators.required]),
            entregaReferencia: new FormControl(""),

            // la fecha de entrega
            deliveryDate: new FormControl<Date | null>(null, [Validators.required, this.deliveryValidator()]),

            // observación (opcional)
            observation: new FormControl(""),

            // imagenes (opcional) 
            image: new FormControl(null)
        }, { validators: this.deliveryAfterPickupValidator() });
    }


    ngAfterViewInit(): void {
        this.onSwiperReady();
    }

    pickupValidator(): ValidatorFn {
        let func = (control: AbstractControl): ValidationErrors | null => {
            const formGroup = control as FormGroup;

            if (!formGroup.value || formGroup.value === '' || formGroup.value === null) {
                return { pickupInvalid: true }; // One or both dates are invalid
            }

            const pickupDate: Date = new Date(formGroup.value);
            const now = new Date();

            const isPickupDateFuture = pickupDate > now;

            if (!isPickupDateFuture) {
                return { pickupNotFuture: true };
            }

            return null;
        }

        return func;
    }

    deliveryValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const formGroup = control as FormGroup;

            if (!formGroup.value || formGroup.value === '' || formGroup.value === null) {
                return { dateInvalid: true }; // One or both dates are invalid
            }

            const deliveryDate: Date = new Date(formGroup.value);
            const now = new Date();



            const isDeliveryDateFuture = deliveryDate > now;

            if (!isDeliveryDateFuture) {
                return { dateNotFuture: true };
            }

            const pickupDate = formGroup.get('pickupDate')?.value;

            if (pickupDate && deliveryDate && deliveryDate < pickupDate) {
                return { deliveryBeforePickup: true };
            }

            return null;
        };
    }

    deliveryAfterPickupValidator(): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const pickupDate = formGroup.get('pickupDate')?.value;
            const deliveryDate = formGroup.get('deliveryDate')?.value;

            if (pickupDate && deliveryDate && deliveryDate < pickupDate) {
                return { deliveryBeforePickup: true };
            }

            return null;
        };
    }

    async onSubmit() {
        this.requestForm.markAllAsTouched();

        if (this.requestForm.invalid) {
            const errorModal = await this.modalController.create({
                component: ErrorModalComponent,
                componentProps: {
                    message: 'Please correct the errors in the form.'
                }
            });
            await errorModal.present();
        } else {
            const formValue = this.requestForm.value;

            const domicilioRetiro = new Domicilio(
                formValue.retiroCalle,
                formValue.retiroNumero,
                this.getLocalidadRetiro(formValue.retiroLocalidad)?.nombre ?? '',
                this.getProvincia(formValue.retiroProvincia)?.nombre ?? '',
                formValue.retiroReferencia
            );

            const domicilioEntrega = new Domicilio(
                formValue.entregaCalle,
                formValue.entregaNumero,
                this.getLocalidadEntrega(formValue.entregaLocalidad)?.nombre ?? '',
                this.getProvincia(formValue.entregaProvincia)?.nombre ?? '',
                formValue.entregaReferencia
            );

            const tipoCarga = new TipoCarga(formValue.loadType);

            const images = this.imageList.map(item => {
                if (typeof item === 'string') {
                    return item;
                } else {
                    // Convert ArrayBuffer to a string if necessary
                    // This example assumes converting to a data URL
                    return this.arrayBufferToDataURL(item);
                }
            });

            const pedidoEnvio = new PedidoEnvio(
                new Date(formValue.pickupDate),
                new Date(formValue.deliveryDate),
                images,
                formValue.observation,
                domicilioEntrega,
                domicilioRetiro,
                tipoCarga
            );

            try {
                await this.pedidoEnvioService.create(pedidoEnvio);
                const successModal = await this.modalController.create({
                    component: SuccessModalComponent,
                    componentProps: {
                        message: 'Pedido creado con exito.'
                    }
                });
                await successModal.present();
            } catch (error) {
                const errorModal = await this.modalController.create({
                    component: ErrorModalComponent,
                    componentProps: {
                        message: 'No se pudo crear el pedido. Intentelo mas tarde.'
                    }
                });
                await errorModal.present();
            }
        }
    }

    arrayBufferToDataURL(buffer: ArrayBuffer): string {
        const blob = new Blob([buffer]);
        return URL.createObjectURL(blob);
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

    getPedidos(): void {
        this.pedidoEnvioService.getAll().subscribe((response: any) => {
            console.log("PEDIDOS: ", response);
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

        this.swiper?.on('slideChange', this.onSlideChange.bind(this));
        if (this.swiper) this.swiper.allowTouchMove = false;

        this.onSlideChange();
    }

    onSlideChange(swiper?: Swiper) {
        this.activeIndex = (swiper ? swiper.activeIndex : this.swiper?.activeIndex) ?? 0;

        console.log('slide change ', this.activeIndex);
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

    getProvincia(id: string) {
        return this.provincias.find((p) => p.id === id);
    }

    getLocalidadEntrega(id: string) {
        return this.localidadesEntrega.find((p) => p.id === id);
    }

    getLocalidadRetiro(id: string) {
        return this.localidadesRetiro.find((p) => p.id === id);
    }
}
