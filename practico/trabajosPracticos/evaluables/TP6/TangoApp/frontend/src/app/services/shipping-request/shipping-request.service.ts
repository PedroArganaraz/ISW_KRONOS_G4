import { Injectable } from '@angular/core';
import { PedidoEnvio } from 'src/app/ts/classes/models/pedidoEnvio';
import { DatabaseService } from '../database/database.service';
import { PedidoEnvioDoc } from 'src/app/ts/interfaces/database-docs/pedidoEnvioDoc';
import { map, Observable } from 'rxjs';

const DB_KEY = 'pedidos-de-envio';

@Injectable({
    providedIn: 'root'
})
export class ShippingRequestService {

    constructor(private dbService: DatabaseService) { }

    // public async getById(id: string): Promise<PedidoEnvio> {
    //     const doc = await this.dbService.getById<PedidoEnvioDoc>(id);

    //     return PedidoEnvio.fromDoc(doc);
    // }

    public async set(data: PedidoEnvio): Promise<void> {
        const doc = data.toDoc();

        this.dbService.set<PedidoEnvioDoc>(doc);
    }

    public getAll(): Observable<Array<PedidoEnvio>> {
        return this.dbService.getAll<PedidoEnvioDoc>(DB_KEY).pipe(
            map((docs: PedidoEnvioDoc[]) => docs.map(doc => PedidoEnvio.fromDoc(doc)))
        );
    }

    public create(pedido: PedidoEnvio): Observable<PedidoEnvio> {
        console.log('Creating pedido:', JSON.stringify(pedido.toDoc()));
        return this.dbService.create<PedidoEnvioDoc>(pedido.toDoc(), DB_KEY).pipe(
            map(docPedido => PedidoEnvio.fromDoc(docPedido))
        );
    }
}
