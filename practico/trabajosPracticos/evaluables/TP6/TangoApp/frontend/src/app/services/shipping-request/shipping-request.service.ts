import { Injectable } from '@angular/core';
import { PedidoEnvio } from 'src/app/ts/classes/models/pedidoEnvio';
import { DatabaseService } from '../database/database.service';
import { PedidoEnvioDoc } from 'src/app/ts/interfaces/database-docs/pedidoEnvioDoc';

@Injectable({
    providedIn: 'root'
})
export class ShippingRequestService {

    constructor(private dbService: DatabaseService) { }

    public async getById(id: string): Promise<PedidoEnvio> {
        const doc = await this.dbService.getById<PedidoEnvioDoc>(id);

        return PedidoEnvio.fromDoc(doc);
    }

    public async set(data: PedidoEnvio): Promise<void> {
        const doc = data.toDoc();

        this.dbService.set<PedidoEnvioDoc>(doc);
    }
}
