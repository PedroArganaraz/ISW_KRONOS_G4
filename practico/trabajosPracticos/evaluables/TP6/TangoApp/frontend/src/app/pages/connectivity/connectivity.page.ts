import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonLabel, IonButton, ModalController } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database/database.service';
import { FormInputComponent } from "../../components/forms/form-input/form-input.component";
import { SuccessModalComponent } from 'src/app/components/modal/success-modal/success-modal.component';
import { ErrorModalComponent } from 'src/app/components/modal/error-modal/error-modal.component';

@Component({
    selector: 'app-connectivity',
    templateUrl: './connectivity.page.html',
    styleUrls: ['./connectivity.page.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, IonButton, IonLabel, IonItem, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, FormInputComponent]
})
export class ConnectivityPage implements OnInit {
    ipForm!: FormGroup;

    constructor(
        private dbService: DatabaseService,
        private modalController: ModalController

    ) { }


    ngOnInit() {

        this.ipForm = new FormGroup({
            ip: new FormControl('', Validators.required),
        });

    }

    async onSubmit() {
        console.log('submited ', this.ipForm.value.ip)
        this.ipForm.markAllAsTouched();

        if (this.ipForm.invalid) {
            const modal = await this.modalController.create({
                component: ErrorModalComponent,
                componentProps: {
                    message: 'Please enter a valid IP address.',
                }
            });
            await modal.present();
        } else {
            try {
                await this.dbService.setIP(this.ipForm.value.ip);
                const modal = await this.modalController.create({
                    component: SuccessModalComponent,
                    componentProps: {
                        message: 'IP address saved successfully.',
                    }
                });
                await modal.present();
            } catch (error) {
                const modal = await this.modalController.create({
                    component: ErrorModalComponent,
                    componentProps: {
                        message: 'Failed to save IP address.',
                    }
                });
                await modal.present();
            }
        }
    }


}
