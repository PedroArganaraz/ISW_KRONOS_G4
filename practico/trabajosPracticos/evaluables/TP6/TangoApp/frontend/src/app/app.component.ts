import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { clipboard, home, wifi } from 'ionicons/icons';
import { testUser } from './ts/constants/user';
import { register } from 'swiper/element/bundle';
import { ThemeService } from './services/theme/theme.service';

register();

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent implements AfterViewInit {
    public appPages = [
        { title: 'Menu', url: 'main', icon: 'home' },
        { title: 'Pedido de Envío', url: 'shipping-request', icon: 'clipboard' },
        { title: 'Conectividad', url: 'connectivity', icon: 'wifi' }

    ];

    constructor(private themeService: ThemeService) {
        addIcons({ home, clipboard, wifi });
        this.themeService.setTheme('light');
    }

    ngAfterViewInit(): void {
        this.themeService.setTheme('light');

    }

    get user() {
        return testUser;
    }
}
