import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, ModalController } from '@ionic/angular/standalone';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error-modal',
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Error</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <p>{{ message }}</p>
    </ion-content>
  `,
    styleUrls: ['./error-modal.component.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent]
})
export class ErrorModalComponent {
    @Input() message: string = '';


    constructor(private modalController: ModalController) {}

    dismiss() {
      this.modalController.dismiss();
    }
}