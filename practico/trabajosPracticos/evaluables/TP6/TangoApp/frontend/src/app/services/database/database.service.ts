import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import { catchError, from, Observable, of, tap } from 'rxjs';
import { Domicilio } from 'src/app/ts/classes/models/domicilio';
import { PedidoEnvio } from 'src/app/ts/classes/models/pedidoEnvio';
import { TipoCarga } from 'src/app/ts/classes/models/tipoCarga';
import { Doc } from 'src/app/ts/interfaces/database-docs/doc';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    ip = 'localhost:8080';

    constructor(private http: HttpClient) { }

    private get isMobilePlatform(): boolean {
        return Capacitor.isNativePlatform();
    }

    public getAll<T extends Doc>(itemKey: string): Observable<Array<T>> {
        const url = this.ip + '/' + itemKey;

        if (this.isMobilePlatform) {
            // Use CapacitorHttp for mobile
            return from(
                CapacitorHttp.get({ url: 'https://' + url })
                    .then(response => response.data as Array<T>)
                    .catch(error => {
                        console.error('Error fetching data on mobile:', error);
                        throw error;
                    })
            );
        } else {
            // Use HttpClient for desktop
            return this.http.get<Array<T>>('http://' + url);
        }
    }

    public async getById<T extends Doc>(id: string): Promise<T> {
        const data = {}; // Mocking data
        return data as T;
    }

    public async set<T extends Doc>(data: T): Promise<T> {
        const setData = {}; // Mocking data set
        return setData as T;
    }

    public create<T extends Doc>(doc: T, itemKey: string): Observable<T> {
        console.log('doc to create ', JSON.stringify(doc));
        const url = this.ip + '/' + itemKey;
        console.log('url ', url)

        if (this.isMobilePlatform) {
            // Use CapacitorHttp for mobile
            return from(
                CapacitorHttp.post({
                    url: 'https://' + url,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(doc)
                }).then((response: HttpResponse) => {
                    console.log('Mobile response:', response);
                    return response.data as T;
                }).catch(error => {
                    console.error('Error creating data on mobile:', error);
                    throw error;
                })
            );
        } else {
            console.log('not mobile');

            const pedido = new PedidoEnvio(new Date(), new Date(), [], 'una obs', new Domicilio('', '', '', '', ''), new Domicilio('', '', '', '', ''), new TipoCarga('Hacienda'));

            console.log('http service ', this.http);


            // Use HttpClient for desktop
            // const headers = new HttpHeaders().set('Content-Type', 'application/json');


            let observable = this.http.post<T>('http://' + url, doc).pipe(
                tap(response => {
                    console.log('response from POST:', response);
                }),
                catchError(error => {
                    console.error('Error occurred:', error);
                    return of({} as T); // Return an empty observable or handle the error as needed
                })
            );

            observable.subscribe((val: any) => {
                console.log('val ', val);
            })

            return observable;
        }
    }

    public setIP(newIp: string) {
        this.ip = newIp;
    }
}

