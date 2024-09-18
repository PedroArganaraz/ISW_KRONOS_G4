import { Doc } from "./doc";
import { DomicilioDoc } from "./domicilioDoc";
import { TipoCargaDoc } from "./tipoCargaDoc";


export interface PedidoEnvioDoc extends Doc {
    fechaRetiro: string;
    fechaEntrega: string;
    imagenes: Array<string>;
    observaciones: string;
    domicilioEntrega: DomicilioDoc;
    domicilioRetiro: DomicilioDoc;
    tipoDeCarga: TipoCargaDoc;
}

