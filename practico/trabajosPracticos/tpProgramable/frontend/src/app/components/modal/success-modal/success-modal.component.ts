import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, ModalController } from '@ionic/angular/standalone';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-success-modal',
//   templateUrl: './success-modal.component.html',
//   styleUrls: ['./success-modal.component.scss'],
// })
// export class SuccessModalComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-success-modal',
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Success</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <p>{{ message }}</p>
    </ion-content>
  `,
    styleUrls: ['./success-modal.component.scss'],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent]
})
export class SuccessModalComponent {
    @Input() message: string = '';


    constructor(private modalController: ModalController) {}

    dismiss() {
      this.modalController.dismiss();
    }
}