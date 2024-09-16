import { Injectable } from '@angular/core';
import { Doc } from 'src/app/ts/interfaces/database-docs/doc';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor() { }

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
}
