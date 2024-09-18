import { Router, Request, Response } from 'express';
import { PedidoDeEnvio } from '../models/PedidoDeEnvio';
import { wss } from '../index'

import { getAllPedidosDeEnvio, addPedidoDeEnvio } from '../mocks/PedidoDeEnvioMockData';
import { enviarMailATransportistas, enviarNotisPushATransportistas } from '../services/NotificacionServices';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/pedidos-de-envio', (req: Request, res: Response) => {
    res.json(getAllPedidosDeEnvio());
});

router.post('/pedidos-de-envio', (req: Request, res: Response) => {
    try {
        const data = req.body;

        const imagenesPaths: string[] = [];
        if (data.imagenes) {
            data.imagenes.forEach((imagenBase64: string, index: number) => {
                const base64Data = imagenBase64.replace(/^data:image\/png;base64,/, '');
                const filePath = path.join(__dirname, `../uploads/imagen${index}.png`);
                fs.writeFileSync(filePath, base64Data, 'base64');
                imagenesPaths.push(filePath);
            });
        }

        const nuevoPedido = PedidoDeEnvio.fromData(data);
        nuevoPedido.imagenes = imagenesPaths;
        addPedidoDeEnvio(nuevoPedido);
        res.status(201).json(nuevoPedido);
        
        console.log(nuevoPedido);

        // Como se creo, tenemos que notificar
        var title = "Nuevo pedido de envío disponible";
        var message = "Hay un pedido de envío en tu zona. ¡Revisa los detalles y no pierdas esta oportunidad!";
        enviarNotisPushATransportistas(title, message, wss);
        enviarMailATransportistas(nuevoPedido);

    } catch (error) {

        res.status(400).json({ error: error.message });
    }
});

export default router;