import { Doc } from "./doc";
import { DomicilioDoc } from "./domicilioDoc";
import { TipoCargaDoc } from "./tipoCargaDoc";


export interface PedidoEnvioDoc extends Doc {
    fechaRetiro: string;
    fechaEntrega: string;
    imagen: string;
    observaciones: string;
    domicilioEntrega: DomicilioDoc;
    domicilioRetiro: DomicilioDoc;
    tipoCarga: TipoCargaDoc;
}

