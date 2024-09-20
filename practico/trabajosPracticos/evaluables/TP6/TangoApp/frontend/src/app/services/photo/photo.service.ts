import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {

    public photos: UserPhoto[] = [];
    private platform: Platform;

    constructor(platform: Platform) {
        this.platform = platform;
    }

    async takePhoto() {
        const photo: Photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 90,
        });

        const savedImageFile = await this.savePhoto(photo);
        this.photos.unshift(savedImageFile);
    }

    private async savePhoto(photo: Photo): Promise<UserPhoto> {
        // Convert photo to base64 format
        const base64Data = await this.readAsBase64(photo);

        // Write the file to the data directory
        const fileName = new Date().getTime() + '.' + photo.format;
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        return {
            filepath: fileName,
            webviewPath: photo.webPath
        };
    }

    private async readAsBase64(photo: Photo): Promise<string> {
        // Fetch the photo as a Blob, then convert to base64 format
        if (this.platform.is('hybrid')) {
            // Use FileSystem API for base64 on native devices
            const file = await Filesystem.readFile({
                path: photo.path!,
            });

            return (file.data instanceof Blob)
                ? await this.convertBlobToBase64(file.data) as string
                : file.data;

        } else {
            // Use web implementation for browser
            const response = await fetch(photo.webPath!);
            const blob = await response.blob();
            return await this.convertBlobToBase64(blob) as string;
        }
    }

    private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
        });
    }

    public async loadSavedPhotos() {
        const photos = await Filesystem.readdir({
            directory: Directory.Data,
            path: ''
        });

        for (const file of photos.files) {
            const filePath = `${Directory.Data}/${file}`;
            const readFile = await Filesystem.readFile({
                path: filePath
            });

            this.photos.unshift({
                filepath: filePath,
                webviewPath: `data:image/jpeg;base64,${readFile.data}`
            });
        }
    }
}

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}