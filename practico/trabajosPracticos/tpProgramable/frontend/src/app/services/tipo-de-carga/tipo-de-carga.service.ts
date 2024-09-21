import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { map, Observable } from 'rxjs';
import { TipoCarga } from 'src/app/ts/classes/models/tipoCarga';
import { TipoCargaDoc } from 'src/app/ts/interfaces/database-docs/tipoCargaDoc';

const DB_KEY = 'tipos-de-carga';

@Injectable({
    providedIn: 'root'
})
export class TipoDeCargaService {

    constructor(private dbService: DatabaseService) {

    }

    public getAll(): Observable<Array<TipoCarga>> {
        return this.dbService.getAll<TipoCargaDoc>(DB_KEY).pipe(
            map((docs: TipoCargaDoc[]) => docs.map(doc => TipoCarga.fromDoc(doc)))
        );
    }
}
