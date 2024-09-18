import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doc } from 'src/app/ts/interfaces/database-docs/doc';

const ROOT_URL = 'http://localhost:8080';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private http: HttpClient) { }

    public getAll<T extends Doc>(itemKey: string): Observable<Array<T>> {
        const url = ROOT_URL + '/' + itemKey;

        return this.http.get<Array<T>>(url);

    }

    public async getById<T extends Doc>(id: string): Promise<T> {
        const data = {};
        return data as T;
    }

    public async set<T extends Doc>(data: T): Promise<T> {

        const couldSet = false;

        // intenamos setear aqui
        const setData = {};

        return setData as T;
    }

    public create<T extends Doc>(doc: T, itemKey: string): Observable<T> {
        console.log('doc to create ', doc);
        const url = ROOT_URL + '/' + itemKey;

        return this.http.post<T>(url, doc);
    }
}


