import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    public photos: string[] = [];
    private platform: Platform;
    private MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

    constructor(platform: Platform) {
        this.platform = platform;
    }

    async takePhoto(): Promise<string> {
        const photo: Photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 90,
            width: 1080,
            height: 1080,
            correctOrientation: true
        });

        if (photo.base64String) {
            // const processedImage = await this.processImage(photo.base64String);
            // this.photos.unshift(processedImage);
            // return processedImage;
            console.log(photo.base64String)
            return photo.base64String
        }
        throw new Error('Failed to capture photo');
    }

    private async processImage(base64: string): Promise<string> {
        return this.resizeAndCompressImage(base64);
    }

    private async resizeAndCompressImage(base64: string): Promise<string> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                const scaleFactor = this.calculateScaleFactor(img.width, img.height);
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                this.compressImage(canvas).then(compressedBase64 => resolve(compressedBase64));
            };
            img.src = `data:image/jpeg;base64,${base64}`;
        });
    }

    private calculateScaleFactor(width: number, height: number): number {
        const maxDimension = 1080;
        return Math.min(1, maxDimension / Math.max(width, height));
    }

    private async compressImage(canvas: HTMLCanvasElement): Promise<string> {
        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (this.getBase64Size(base64) > this.MAX_FILE_SIZE && quality > 0.1) {
            quality -= 0.1;
            base64 = canvas.toDataURL('image/jpeg', quality);
        }

        return base64.split(',')[1]; // Remove the data:image/jpeg;base64, part
    }

    private getBase64Size(base64: string): number {
        const base64Length = base64.length - (base64.indexOf(',') + 1);
        const padding = (base64.charAt(base64.length - 2) === '=') ? 2 : ((base64.charAt(base64.length - 1) === '=') ? 1 : 0);
        return base64Length * 0.75 - padding;
    }
}