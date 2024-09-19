import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { Doc } from 'src/app/ts/interfaces/database-docs/doc';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    ip = 'http://localhost:8080';

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
            return this.http.get<Array<T>>(url);
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
        console.log('doc to create ', doc);
        const url = this.ip + '/' + itemKey;

        if (this.isMobilePlatform) {
            // Use CapacitorHttp for mobile
            return from(
                CapacitorHttp.post({ url: 'https://' + url, data: doc })
                    .then((response: any) => response.data as T)
                    .catch(error => {
                        console.error('Error creating data on mobile:', error);
                        throw error;
                    })
            );
        } else {
            // Use HttpClient for desktop
            return this.http.post<T>(url, doc);
        }
    }


    public setIP(newIp: string) {
        this.ip = newIp;
    }
}
