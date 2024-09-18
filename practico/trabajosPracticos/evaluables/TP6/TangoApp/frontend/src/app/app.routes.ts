import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
    },
    {
        path: 'main',
        loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage)
    },
    {
        path: 'shipping-request',
        loadComponent: () => import('./pages/shipping-request/shipping-request.page').then(m => m.ShippingRequestPage)
    },
    {
        path: 'connectivity',
        loadComponent: () => import('./pages/connectivity/connectivity.page').then(m => m.ConnectivityPage)
    },
];
