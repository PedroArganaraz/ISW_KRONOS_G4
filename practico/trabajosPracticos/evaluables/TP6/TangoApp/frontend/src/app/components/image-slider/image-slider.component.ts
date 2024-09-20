import { Component, Input, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { add, closeCircle } from 'ionicons/icons';
import Swiper from 'swiper';
// import 'swiper/swiper-bundle.min.css';

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
            this.addImageFromCamera();
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
            resultType: CameraResultType.DataUrl, // Base64 format
            source: CameraSource.Camera, // Camera source
        });

        if (!image.dataUrl) return;

        this.images.push(image.dataUrl);
        this.imagesSelected.emit(this.images); // Emit the selected image to the parent component
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