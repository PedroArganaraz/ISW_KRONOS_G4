import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-image-importer',
    templateUrl: './image-importer.component.html',
    styleUrls: ['./image-importer.component.scss'],
    standalone: true,
    imports: [IonButton,],
})
export class ImageImporterComponent {

    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    @Input() allowCamera: boolean = true; // Allow camera functionality by default
    @Output() imageSelected = new EventEmitter<string | ArrayBuffer | null>();

    imageSrc: string | ArrayBuffer | null = null;

    constructor() { }

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
                this.imageSrc = reader.result;
                this.imageSelected.emit(this.imageSrc);
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

        this.imageSrc = image.dataUrl;
        this.imageSelected.emit(this.imageSrc); // Emit the selected image to the parent component
    }

    // Helper method to detect mobile or PWA environment
    isMobile() {
        return window.innerWidth <= 768;
    }

    isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches;
    }
}