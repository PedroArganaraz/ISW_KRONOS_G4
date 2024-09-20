import { Component, Input, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { add, closeCircle } from 'ionicons/icons';
import Swiper from 'swiper';
// import 'swiper/swiper-bundle.min.css';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-image-slider',
    templateUrl: './image-slider.component.html',
    styleUrls: ['./image-slider.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    imports: []
})
export class ImageSliderComponent implements AfterViewInit {



    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    @Input() allowCamera: boolean = true; // Allow camera functionality by default
    @Input() limit: number = 10;
    @Output() imagesSelected = new EventEmitter<Array<string | ArrayBuffer>>();

    // imageSrc: string | ArrayBuffer | null = null;
    images: Array<string | ArrayBuffer> = []; // Input to pass an array of image URLs

    get canAddImages(): boolean {
        return this.images.length < this.limit;
    }

    get isAndorid(): boolean
    {
        return Capacitor.getPlatform() === 'android';
    }

    constructor() {
        addIcons({ add, closeCircle })
    }

    ngAfterViewInit() {

        const swiper = new Swiper('.swiper-container', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            grabCursor: true,
            centeredSlides: true,
            effect: 'slide', // You can use 'slide', 'fade', 'cube', etc.
            speed: 800 // Transition speed in milliseconds
        });
    }

    selectImage() {
        if (this.allowCamera && (this.isMobile() || this.isPWA())) {
            this.addImageFromGallery();
        } else {
            this.fileInput.nativeElement.click();
        }
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (!reader.result) return;

                console.log('reader res ', reader.result)

                this.images.push(reader.result);

                this.imagesSelected.emit(this.images);
            };
            reader.readAsDataURL(file);
        }
    }

    async addImageFromCamera() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64, // Base64 format
            source: CameraSource.Camera, // Camera source
        });

        console.log('imagee : ', image)
        if (!image.base64String) return;

        const img = 'data:image/jpeg;base64,' + image.base64String;

        this.images.push(img);
        this.imagesSelected.emit(this.images); // Emit the selected image to the parent component
    }

    async addImageFromGallery() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64, // Base64 format
            source: CameraSource.Photos, // Gallery source
        });

        console.log('imagee : ', image)
        if (!image.base64String) return;

        const img = 'data:image/jpeg;base64,' + image.base64String;

        console.log('image to add from gallery ', img)
        this.images.push(img);

        // this.images.push(image.base64String);
        this.imagesSelected.emit(this.images); // Emit the selected image to the parent component
    }

    private async readAsBase64(webPath: string): Promise<string | null> {
        try {
            const response = await fetch(webPath);
            const blob = await response.blob();

            return await this.convertBlobToBase64(blob) as string;
        } catch (error) {
            console.error('Error reading image as base64', error);
            return null;
        }
    }

    private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
        });
    }

    // Helper method to detect mobile or PWA environment
    isMobile() {
        return window.innerWidth <= 768;
    }

    isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches;
    }


    removeImage(index: number) {
        this.images.splice(index, 1);
        this.imagesSelected.emit(this.images);
    }
}