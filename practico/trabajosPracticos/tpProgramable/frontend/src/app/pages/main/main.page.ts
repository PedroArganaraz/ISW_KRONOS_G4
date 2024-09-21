import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonButtons, IonMenuButton } from '@ionic/angular/standalone';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
    standalone: true,
    imports: [IonButtons, IonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton]
})
export class MainPage {

    constructor() { }

}
